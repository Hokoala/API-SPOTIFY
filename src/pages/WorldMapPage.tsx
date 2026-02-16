import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Header } from "@/layout/header"
import { Footer } from "@/components/Footer"
import { DottedMap } from "@/components/ui/dotted-map"
import { COUNTRY_POSITIONS, countryFlag } from "@/components/map/worldMapPaths"
import { CountryTooltip } from "@/components/map/CountryTooltip"
import type { SpotifyData } from "@/App"

// Convert x,y (1000x500 equirectangular) to lat/lng
function posToLatLng(x: number, y: number) {
    return {
        lat: 90 - (y / 500) * 180,
        lng: (x / 1000) * 360 - 180,
    }
}

interface WorldMapPageProps {
    onLogout: () => void
    spotifyData: SpotifyData
}

const AREA_TO_CODE: Record<string, string> = {
    "United States": "US", "United Kingdom": "GB", "France": "FR", "Germany": "DE",
    "Spain": "ES", "Italy": "IT", "Canada": "CA", "Brazil": "BR", "Japan": "JP",
    "South Korea": "KR", "Australia": "AU", "Mexico": "MX", "Sweden": "SE",
    "Norway": "NO", "Denmark": "DK", "Finland": "FI", "Netherlands": "NL",
    "Belgium": "BE", "Switzerland": "CH", "Austria": "AT", "Poland": "PL",
    "Russia": "RU", "Ukraine": "UA", "Turkey": "TR", "China": "CN", "India": "IN",
    "Nigeria": "NG", "South Africa": "ZA", "Egypt": "EG", "Morocco": "MA",
    "Algeria": "DZ", "Kenya": "KE", "Israel": "IL", "Saudi Arabia": "SA",
    "United Arab Emirates": "AE", "Philippines": "PH", "Indonesia": "ID",
    "Thailand": "TH", "Vietnam": "VN", "Malaysia": "MY", "Pakistan": "PK",
    "Bangladesh": "BD", "Cuba": "CU", "Jamaica": "JM", "Puerto Rico": "PR",
    "Colombia": "CO", "Argentina": "AR", "Chile": "CL", "Peru": "PE",
    "Romania": "RO", "Greece": "GR", "Czech Republic": "CZ", "Hungary": "HU",
    "Portugal": "PT", "Ireland": "IE", "New Zealand": "NZ", "Venezuela": "VE",
}

function getCacheKey(artistId: string) {
    return `spotify_artist_country_${artistId}`
}

async function fetchArtistCountry(artistName: string): Promise<string | null> {
    try {
        const res = await fetch(
            `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(artistName)}&fmt=json&limit=1`,
            { headers: { Accept: "application/json" } }
        )
        if (!res.ok) return null
        const data = await res.json()
        const artist = data.artists?.[0]
        if (!artist) return null
        const area = artist.area?.name || artist["begin-area"]?.name || null
        if (!area) return null
        return AREA_TO_CODE[area] || null
    } catch {
        return null
    }
}

export default function WorldMapPage({ onLogout, spotifyData }: WorldMapPageProps) {
    const { user, topArtists } = spotifyData
    const [countryArtists, setCountryArtists] = useState<Record<string, string[]>>({})
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [currentArtist, setCurrentArtist] = useState("")
    const [tooltip, setTooltip] = useState<{ code: string; x: number; y: number } | null>(null)
    const abortRef = useRef(false)

    useEffect(() => {
        if (topArtists.length === 0) return
        abortRef.current = false
        setLoading(true)

        const loadCountries = async () => {
            const result: Record<string, string[]> = {}
            const total = Math.min(topArtists.length, 30)

            // Phase 1: process all cached artists instantly (no API calls)
            const uncachedIndices: number[] = []
            for (let i = 0; i < total; i++) {
                const artist = topArtists[i]
                const cached = localStorage.getItem(getCacheKey(artist.id))
                if (cached !== null) {
                    const code = cached === "" ? null : cached
                    if (code) {
                        if (!result[code]) result[code] = []
                        if (!result[code].includes(artist.name)) {
                            result[code].push(artist.name)
                        }
                    }
                } else {
                    uncachedIndices.push(i)
                }
            }

            // Update state once with all cached results
            const cachedCount = total - uncachedIndices.length
            if (cachedCount > 0) {
                setCountryArtists({ ...result })
                setProgress(Math.round((cachedCount / total) * 100))
            }

            // Phase 2: fetch uncached artists with rate limiting
            for (let j = 0; j < uncachedIndices.length; j++) {
                if (abortRef.current) break
                const i = uncachedIndices[j]
                const artist = topArtists[i]
                setCurrentArtist(artist.name)

                const code = await fetchArtistCountry(artist.name)
                localStorage.setItem(getCacheKey(artist.id), code || "")

                if (code) {
                    if (!result[code]) result[code] = []
                    if (!result[code].includes(artist.name)) {
                        result[code].push(artist.name)
                    }
                }

                setCountryArtists({ ...result })
                setProgress(Math.round(((cachedCount + j + 1) / total) * 100))

                // Rate limit: 1 req/sec for MusicBrainz API
                if (j < uncachedIndices.length - 1) {
                    await new Promise((r) => setTimeout(r, 1100))
                }
            }
            setCurrentArtist("")
            setLoading(false)
        }

        loadCountries()
        return () => { abortRef.current = true }
    }, [topArtists])

    // Memoize markers to avoid recreating the array on every render
    const markers = useMemo(() => {
        const maxCount = Math.max(1, ...Object.values(countryArtists).map(a => a.length))
        return Object.entries(countryArtists).flatMap(([code, artists]) => {
            const pos = COUNTRY_POSITIONS[code]
            if (!pos) return []
            const { lat, lng } = posToLatLng(pos.x, pos.y)
            const intensity = artists.length / maxCount
            return [{ lat, lng, size: 0.5 + intensity * 1 }]
        })
    }, [countryArtists])

    // Stable tooltip handlers
    const handleMouseEnter = useCallback((code: string, e: React.MouseEvent) => {
        setTooltip({ code, x: e.clientX, y: e.clientY })
    }, [])
    const handleMouseMove = useCallback((code: string, e: React.MouseEvent) => {
        setTooltip({ code, x: e.clientX, y: e.clientY })
    }, [])
    const handleMouseLeave = useCallback(() => setTooltip(null), [])

    const countriesCount = Object.keys(countryArtists).length
    const totalArtistsLocated = Object.values(countryArtists).reduce((s, a) => s + a.length, 0)
    const sortedCountries = Object.entries(countryArtists).sort((a, b) => b[1].length - a[1].length)
    const topCountry = sortedCountries[0]

    return (
        <div className="min-h-screen bg-black text-white">
            <Header
                user={{
                    name: user?.display_name || "Utilisateur",
                    email: user?.email || "",
                    image: user?.images?.[0]?.url,
                }}
                onLogout={onLogout}
            />

            <main className="container mx-auto px-4 py-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                        Carte du monde
                    </h1>
                    <p className="text-zinc-400">
                        Decouvre les origines de tes artistes preferes
                    </p>
                </div>

                {/* Loading bar */}
                {loading && (
                    <div className="max-w-lg mx-auto mb-6">
                        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-zinc-400">Recherche en cours...</span>
                                <span className="text-sm text-green-400 font-semibold">{progress}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            {currentArtist && (
                                <p className="text-zinc-500 text-xs truncate">
                                    Recherche : {currentArtist}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-3xl mx-auto">
                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
                        <p className="text-2xl font-bold text-green-400">{countriesCount}</p>
                        <p className="text-zinc-500 text-xs mt-1">Pays</p>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
                        <p className="text-2xl font-bold text-blue-400">{totalArtistsLocated}</p>
                        <p className="text-zinc-500 text-xs mt-1">Artistes localises</p>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
                        <p className="text-2xl font-bold text-purple-400">
                            {topCountry ? countryFlag(topCountry[0]) : "-"}
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">Pays #1</p>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
                        <p className="text-2xl font-bold text-amber-400">{Math.min(topArtists.length, 30)}</p>
                        <p className="text-zinc-500 text-xs mt-1">Artistes analyses</p>
                    </div>
                </div>

                {/* Map */}
                <div className="bg-zinc-900 rounded-2xl p-3 md:p-6 border border-zinc-800 mb-8 overflow-hidden">
                    <div className="relative" style={{ aspectRatio: "2 / 1" }}>
                        <DottedMap
                            dotRadius={0.15}
                            mapSamples={8000}
                            markers={markers}
                            markerColor="#22c55e"
                            className="text-zinc-600"
                        />
                        {/* Interactive overlay for tooltips */}
                        <div className="absolute inset-0">
                            {Object.entries(countryArtists).map(([code]) => {
                                const pos = COUNTRY_POSITIONS[code]
                                if (!pos) return null
                                const left = (pos.x / 1000) * 100
                                const top = (pos.y / 500) * 100
                                return (
                                    <div
                                        key={code}
                                        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full"
                                        style={{ left: `${left}%`, top: `${top}%` }}
                                        onMouseEnter={(e) => handleMouseEnter(code, e)}
                                        onMouseMove={(e) => handleMouseMove(code, e)}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    {tooltip && countryArtists[tooltip.code] && (
                        <CountryTooltip
                            code={tooltip.code}
                            name={COUNTRY_POSITIONS[tooltip.code]?.name || tooltip.code}
                            artists={countryArtists[tooltip.code]}
                            x={tooltip.x}
                            y={tooltip.y}
                        />
                    )}
                </div>

                {/* Country list */}
                {sortedCountries.length > 0 && (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Artistes par pays</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {sortedCountries.map(([code, artists], index) => (
                                <div
                                    key={code}
                                    className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{countryFlag(code)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm">
                                                {COUNTRY_POSITIONS[code]?.name || code}
                                            </p>
                                            <p className="text-zinc-500 text-xs">
                                                {artists.length} artiste{artists.length > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                        {index === 0 && (
                                            <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full font-semibold">
                                                #1
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {artists.map((a) => (
                                            <span
                                                key={a}
                                                className="px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-lg"
                                            >
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && sortedCountries.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-4">🌍</p>
                        <p className="text-zinc-400">Aucun artiste localise pour le moment.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
