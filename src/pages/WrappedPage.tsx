import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SlideWelcome } from "@/components/wrapped/SlideWelcome"
import { SlideTopGenre } from "@/components/wrapped/SlideTopGenre"
import { SlideListeningStats } from "@/components/wrapped/SlideListeningStats"
import { SlideTopArtists } from "@/components/wrapped/SlideTopArtists"
import { SlideTopTracks } from "@/components/wrapped/SlideTopTracks"
import { SlideTopAlbum } from "@/components/wrapped/SlideTopAlbum"
import { SlideMood } from "@/components/wrapped/SlideMood"
import { SlideSummary } from "@/components/wrapped/SlideSummary"
import type { SpotifyData } from "@/App"

interface WrappedPageProps {
    spotifyData: SpotifyData
    token: string
}

interface AudioFeatures {
    energy: number
    danceability: number
    valence: number
}

export default function WrappedPage({ spotifyData, token }: WrappedPageProps) {
    const navigate = useNavigate()
    const [slide, setSlide] = useState(0)
    const [mood, setMood] = useState({ energy: 0.5, danceability: 0.5, valence: 0.5 })
    const { user, topArtists, topTracks } = spotifyData

    const TOTAL_SLIDES = 8

    // Compute genres
    const genreCounts: Record<string, number> = {}
    topArtists.forEach((a) => a.genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1
    }))
    const genres = Object.entries(genreCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)

    const topGenre = genres[0]?.name || "N/A"

    const uniqueArtists = new Set<string>()
    topTracks.forEach((t) => t.artists.forEach((a) => uniqueArtists.add(a.name)))
    const totalMinutes = Math.round(topTracks.reduce((s, t) => s + t.duration_ms, 0) / 60000)

    // Fetch audio features for mood
    useEffect(() => {
        if (!token || topTracks.length === 0) return
        const ids = topTracks.slice(0, 20).map((t) => t.id).join(",")
        fetch(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
                if (!data?.audio_features) return
                const valid: AudioFeatures[] = data.audio_features.filter((f: AudioFeatures | null) => f !== null)
                if (valid.length === 0) return
                const avg = (key: keyof AudioFeatures) =>
                    valid.reduce((s, f) => s + f[key], 0) / valid.length
                setMood({
                    energy: avg("energy"),
                    danceability: avg("danceability"),
                    valence: avg("valence"),
                })
            })
            .catch(() => {})
    }, [token, topTracks])

    const next = () => setSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1))
    const prev = () => setSlide((s) => Math.max(s - 1, 0))

    const handleClick = (e: React.MouseEvent) => {
        // Click left half = prev, right half = next
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        if (x < rect.width / 3) {
            prev()
        } else {
            next()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === " ") next()
        if (e.key === "ArrowLeft") prev()
        if (e.key === "Escape") navigate("/dashboard")
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black overflow-hidden cursor-pointer select-none"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="presentation"
        >
            {/* Close button */}
            <button
                onClick={(e) => { e.stopPropagation(); navigate("/dashboard") }}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 px-4 pt-2">
                {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-full bg-white/20">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                i < slide ? "bg-white w-full" : i === slide ? "bg-white w-full" : "w-0"
                            }`}
                            style={{ width: i <= slide ? "100%" : "0%" }}
                        />
                    </div>
                ))}
            </div>

            {/* Slides */}
            <div className="h-full">
                {slide === 0 && <SlideWelcome userName={user?.display_name || "Utilisateur"} active={slide === 0} />}
                {slide === 1 && <SlideTopGenre genres={genres} active={slide === 1} />}
                {slide === 2 && (
                    <SlideListeningStats
                        totalMinutes={totalMinutes}
                        uniqueArtists={uniqueArtists.size}
                        uniqueTracks={topTracks.length}
                        active={slide === 2}
                    />
                )}
                {slide === 3 && <SlideTopArtists artists={topArtists} active={slide === 3} />}
                {slide === 4 && <SlideTopTracks tracks={topTracks} active={slide === 4} />}
                {slide === 5 && <SlideTopAlbum tracks={topTracks} active={slide === 5} />}
                {slide === 6 && (
                    <SlideMood
                        energy={mood.energy}
                        danceability={mood.danceability}
                        valence={mood.valence}
                        active={slide === 6}
                    />
                )}
                {slide === 7 && (
                    <SlideSummary
                        userName={user?.display_name || "Utilisateur"}
                        topArtist={topArtists[0] || null}
                        topTrack={topTracks[0] || null}
                        topGenre={topGenre}
                        totalMinutes={totalMinutes}
                        active={slide === 7}
                    />
                )}
            </div>
        </div>
    )
}
