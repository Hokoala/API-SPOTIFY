import { Header } from "@/layout/header"
import { useState } from "react"
import { GenreDonutChart } from "@/components/GenreDonutChart"
import { PopularityBars } from "@/components/PopularityBars"
import { RecentlyPlayed } from "@/components/RecentlyPlayed"
import { TopAlbums } from "@/components/TopAlbums"
import { UserStatsCards } from "@/components/UserStatsCards"
import { Footer } from "@/components/Footer"
import { TopArtistsGrid } from "@/components/TopArtistsGrid"
import { TopTracksList } from "@/components/TopTracksList"
import { SimilarArtists } from "@/components/SimilarArtists"
import { TempoAnalysis } from "@/components/TempoAnalysis"
import { ExportStats } from "@/components/ExportStats"
import { MusicCompatibility } from "@/components/MusicCompatibility"
import type { SpotifyData, TimeRange } from "@/App"

interface DashboardPageProps {
    onLogout: () => void
    spotifyData: SpotifyData
    timeRange: TimeRange
    onTimeRangeChange: (range: TimeRange) => void
    isLoading: boolean
    token: string
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
    { value: "short_term", label: "4 dernieres semaines" },
    { value: "medium_term", label: "6 derniers mois" },
    { value: "long_term", label: "Depuis toujours" },
]

export default function DashboardPage({ onLogout, spotifyData, timeRange, onTimeRangeChange, isLoading, token }: DashboardPageProps) {
    const [activeTab, setActiveTab] = useState<"artists" | "tracks">("artists")

    const { user, topArtists, topTracks, recentTracks } = spotifyData

    // Calculer les genres à partir des artistes
    const genreCounts: Record<string, number> = {}
    topArtists.forEach((artist) => {
        artist.genres.forEach((genre) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
    })
    const genres = Object.entries(genreCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)

    // Transformer les recentTracks pour le composant
    const formattedRecentTracks = recentTracks.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(", "),
        album: item.track.album.name,
        albumImage: item.track.album.images[0]?.url || "",
        playedAt: item.played_at,
    }))

    // Calculer les albums les plus écoutés à partir des tracks
    const albumCounts: Record<string, { name: string; artist: string; image: string; count: number }> = {}
    topTracks.forEach((track) => {
        const albumId = track.album.name
        if (!albumCounts[albumId]) {
            albumCounts[albumId] = {
                name: track.album.name,
                artist: track.artists.map((a) => a.name).join(", "),
                image: track.album.images[0]?.url || "",
                count: 0,
            }
        }
        albumCounts[albumId].count += 1
    })
    const topAlbums = Object.entries(albumCounts)
        .map(([id, data]) => ({ id, ...data, playCount: data.count * 10 }))
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 6)

    // Calculer le genre le plus écouté
    const topGenre = genres[0]?.name || "N/A"

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

                {/* Similar Artists */}
                <div className="mb-8">
                    <SimilarArtists artists={topArtists} token={token} />
                </div>

                {/* User Stats */}
                {user && <UserStatsCards user={user} />}

                {/* Music Compatibility */}
                <MusicCompatibility spotifyData={spotifyData} />

                {/* Time Range Selector */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-sm font-medium text-zinc-400 mr-2">Periode :</span>
                    {TIME_RANGE_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => onTimeRangeChange(option.value)}
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm rounded-full font-medium transition-all ${
                                timeRange === option.value
                                    ? "bg-green-500 text-black"
                                    : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {option.label}
                        </button>
                    ))}
                    {isLoading && (
                        <div className="ml-2 animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("artists")}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                            activeTab === "artists"
                                ? "bg-green-500 text-black"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                        }`}
                    >
                        Top Artistes
                    </button>
                    <button
                        onClick={() => setActiveTab("tracks")}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                            activeTab === "tracks"
                                ? "bg-green-500 text-black"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                        }`}
                    >
                        Top Titres
                    </button>
                </div>

                {/* Top Artists Grid */}
                {activeTab === "artists" && <TopArtistsGrid artists={topArtists} />}

                {/* Top Tracks List */}
                {activeTab === "tracks" && <TopTracksList tracks={topTracks} />}

                {/* Genre Chart + Popularity Bars */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {genres.length > 0 && <GenreDonutChart genres={genres} />}
                    {topArtists.length > 0 && <PopularityBars artists={topArtists.slice(0, 5)} />}
                </div>

                {/* Tempo / BPM Analysis */}
                {topTracks.length > 0 && (
                    <TempoAnalysis trackIds={topTracks.map((t) => t.id)} token={token} />
                )}

                {/* Recently Played + Top Albums */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {formattedRecentTracks.length > 0 && <RecentlyPlayed tracks={formattedRecentTracks} />}
                    {topAlbums.length > 0 && <TopAlbums albums={topAlbums} />}
                </div>

                {/* Export Stats as Image */}
                <ExportStats
                    spotifyData={spotifyData}
                    timeRange={timeRange}
                    topGenre={topGenre}
                    totalMinutes={Math.round(topTracks.reduce((sum, t) => sum + t.duration_ms, 0) / 60000)}
                />
            </main>

            <Footer />
        </div>
    )
}
