import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Header } from "@/layout/header"
import { Footer } from "@/components/Footer"
import type { SpotifyData } from "@/App"

interface FriendProfile {
    userName: string
    userImage: string
    artistIds: string[]
    artistNames: string[]
    trackIds: string[]
    trackNames: string[]
    genres: string[]
}

interface ComparePageProps {
    onLogout: () => void
    spotifyData: SpotifyData
    token?: string
}

function computeCompatibility(myProfile: FriendProfile, friendProfile: FriendProfile) {
    // Common genres (40%)
    const myGenres = new Set(myProfile.genres)
    const commonGenres = friendProfile.genres.filter((g) => myGenres.has(g))
    const genreScore = myProfile.genres.length > 0
        ? (commonGenres.length / Math.max(myProfile.genres.length, friendProfile.genres.length)) * 100
        : 0

    // Common artists (35%)
    const myArtistIds = new Set(myProfile.artistIds)
    const commonArtistIndices: number[] = []
    friendProfile.artistIds.forEach((id, i) => {
        if (myArtistIds.has(id)) commonArtistIndices.push(i)
    })
    const commonArtists = commonArtistIndices.map((i) => friendProfile.artistNames[i])
    const artistScore = myProfile.artistIds.length > 0
        ? (commonArtists.length / Math.max(myProfile.artistIds.length, friendProfile.artistIds.length)) * 100
        : 0

    // Common tracks (25%)
    const myTrackIds = new Set(myProfile.trackIds)
    const commonTrackIndices: number[] = []
    friendProfile.trackIds.forEach((id, i) => {
        if (myTrackIds.has(id)) commonTrackIndices.push(i)
    })
    const commonTracks = commonTrackIndices.map((i) => friendProfile.trackNames[i])
    const trackScore = myProfile.trackIds.length > 0
        ? (commonTracks.length / Math.max(myProfile.trackIds.length, friendProfile.trackIds.length)) * 100
        : 0

    const totalScore = Math.round(genreScore * 0.4 + artistScore * 0.35 + trackScore * 0.25)

    return { totalScore, commonGenres, commonArtists, commonTracks }
}

export default function ComparePage({ onLogout, spotifyData }: ComparePageProps) {
    const [searchParams] = useSearchParams()
    const [friendProfile, setFriendProfile] = useState<FriendProfile | null>(null)
    const [error, setError] = useState(false)

    const { user, topArtists, topTracks } = spotifyData

    useEffect(() => {
        const dataParam = searchParams.get("data")
        if (!dataParam) {
            setError(true)
            return
        }
        try {
            const decoded = JSON.parse(decodeURIComponent(atob(dataParam)))
            setFriendProfile(decoded)
        } catch {
            setError(true)
        }
    }, [searchParams])

    // Build my profile
    const genreCounts: Record<string, number> = {}
    topArtists.forEach((artist) => {
        artist.genres.forEach((genre) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
    })
    const myGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name]) => name)

    const myProfile: FriendProfile = {
        userName: user?.display_name || "Moi",
        userImage: user?.images?.[0]?.url || "",
        artistIds: topArtists.slice(0, 15).map((a) => a.id),
        artistNames: topArtists.slice(0, 15).map((a) => a.name),
        trackIds: topTracks.slice(0, 15).map((t) => t.id),
        trackNames: topTracks.slice(0, 15).map((t) => t.name),
        genres: myGenres,
    }

    const compatibility = friendProfile ? computeCompatibility(myProfile, friendProfile) : null

    // Circular score
    const score = compatibility?.totalScore || 0
    const circumference = 2 * Math.PI * 44
    const strokeDashoffset = circumference - (score / 100) * circumference

    const scoreColor =
        score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444"

    if (error) {
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
                <main className="container mx-auto px-4 py-16 text-center">
                    <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 max-w-md mx-auto">
                        <p className="text-xl font-bold text-red-400 mb-2">Lien invalide</p>
                        <p className="text-zinc-400">Le lien de comparaison est invalide ou corrompu.</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!friendProfile || !compatibility) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
        )
    }

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
                <h1 className="text-2xl font-bold text-center mb-8">Compatibilite musicale</h1>

                {/* Two profiles side by side */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* My profile */}
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-center">
                        {myProfile.userImage ? (
                            <img
                                src={myProfile.userImage}
                                alt={myProfile.userName}
                                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-green-500"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-zinc-800 flex items-center justify-center ring-2 ring-green-500">
                                <span className="text-2xl font-bold">{myProfile.userName[0]}</span>
                            </div>
                        )}
                        <p className="text-lg font-bold text-white">{myProfile.userName}</p>
                        <p className="text-zinc-400 text-sm">Toi</p>
                    </div>

                    {/* Score */}
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex flex-col items-center justify-center">
                        <div className="relative w-28 h-28 mb-3">
                            <svg className="w-28 h-28 -rotate-90">
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="44"
                                    fill="none"
                                    stroke="#27272a"
                                    strokeWidth="6"
                                />
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="44"
                                    fill="none"
                                    stroke={scoreColor}
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold" style={{ color: scoreColor }}>
                                    {score}%
                                </span>
                            </div>
                        </div>
                        <p className="text-zinc-400 text-sm">Score de compatibilite</p>
                    </div>

                    {/* Friend profile */}
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-center">
                        {friendProfile.userImage ? (
                            <img
                                src={friendProfile.userImage}
                                alt={friendProfile.userName}
                                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-purple-500"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-zinc-800 flex items-center justify-center ring-2 ring-purple-500">
                                <span className="text-2xl font-bold">{friendProfile.userName[0]}</span>
                            </div>
                        )}
                        <p className="text-lg font-bold text-white">{friendProfile.userName}</p>
                        <p className="text-zinc-400 text-sm">Ami(e)</p>
                    </div>
                </div>

                {/* Common elements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Common Artists */}
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Artistes en commun ({compatibility.commonArtists.length})
                        </h3>
                        {compatibility.commonArtists.length > 0 ? (
                            <ul className="space-y-2">
                                {compatibility.commonArtists.map((name) => (
                                    <li key={name} className="text-zinc-300 text-sm flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-zinc-500 text-sm">Aucun artiste en commun</p>
                        )}
                    </div>

                    {/* Common Tracks */}
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Titres en commun ({compatibility.commonTracks.length})
                        </h3>
                        {compatibility.commonTracks.length > 0 ? (
                            <ul className="space-y-2">
                                {compatibility.commonTracks.map((name) => (
                                    <li key={name} className="text-zinc-300 text-sm flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-zinc-500 text-sm">Aucun titre en commun</p>
                        )}
                    </div>

                    {/* Common Genres */}
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Genres en commun ({compatibility.commonGenres.length})
                        </h3>
                        {compatibility.commonGenres.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {compatibility.commonGenres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full capitalize"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm">Aucun genre en commun</p>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
