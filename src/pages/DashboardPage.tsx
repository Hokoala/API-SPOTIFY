import { Header } from "@/layout/header"
import { useState } from "react"
import { GenreDonutChart } from "@/components/GenreDonutChart"
import { ListeningStats } from "@/components/ListeningStats"
import { PopularityBars } from "@/components/PopularityBars"
import { RecentlyPlayed } from "@/components/RecentlyPlayed"
import { TopAlbums } from "@/components/TopAlbums"
import { UserStatsCards } from "@/components/UserStatsCards"
import { Footer } from "@/components/Footer"
import { TopArtistsGrid } from "@/components/TopArtistsGrid"
import { TopTracksList } from "@/components/TopTracksList"

// Mock data
const mockUser = {
    display_name: "Jean Dupont",
    email: "jean.dupont@email.com",
    images: [{ url: "https://i.pravatar.cc/150?img=68" }],
    followers: { total: 142 },
    country: "FR",
    product: "premium",
}

const mockArtists = [
    { id: "1", name: "Daft Punk", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eba7bfd7835b5c1eee0c95fa6e" }], genres: ["electronic", "french house"], popularity: 85 },
    { id: "2", name: "The Weeknd", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb" }], genres: ["pop", "r&b"], popularity: 95 },
    { id: "3", name: "Kendrick Lamar", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022" }], genres: ["hip hop", "rap"], popularity: 92 },
    { id: "4", name: "Arctic Monkeys", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }], genres: ["rock", "indie"], popularity: 88 },
    { id: "5", name: "Tyler, The Creator", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb8278b782cbb5a3963db88ada" }], genres: ["hip hop", "alternative"], popularity: 89 },
]

const mockTracks = [
    { id: "1", name: "Blinding Lights", artists: [{ name: "The Weeknd" }], album: { name: "After Hours", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36" }] }, duration_ms: 200040 },
    { id: "2", name: "HUMBLE.", artists: [{ name: "Kendrick Lamar" }], album: { name: "DAMN.", images: [{ url: "https://i.scdn.co/image/ab67616d0000b273d28d2ebdedb220e479743797" }] }, duration_ms: 177000 },
    { id: "3", name: "Do I Wanna Know?", artists: [{ name: "Arctic Monkeys" }], album: { name: "AM", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163" }] }, duration_ms: 272394 },
    { id: "4", name: "Get Lucky", artists: [{ name: "Daft Punk" }, { name: "Pharrell Williams" }], album: { name: "Random Access Memories", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937" }] }, duration_ms: 369626 },
    { id: "5", name: "EARFQUAKE", artists: [{ name: "Tyler, The Creator" }], album: { name: "IGOR", images: [{ url: "https://i.scdn.co/image/ab67616d0000b273968fd4d60fb51c1e0a74e6b0" }] }, duration_ms: 190067 },
]

const mockGenres = [
    { name: "hip hop", count: 45 },
    { name: "pop", count: 32 },
    { name: "electronic", count: 28 },
    { name: "rock", count: 22 },
    { name: "r&b", count: 18 },
    { name: "indie", count: 15 },
]

const mockRecentTracks = [
    { id: "1", name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", albumImage: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36", playedAt: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: "2", name: "HUMBLE.", artist: "Kendrick Lamar", album: "DAMN.", albumImage: "https://i.scdn.co/image/ab67616d0000b273d28d2ebdedb220e479743797", playedAt: new Date(Date.now() - 25 * 60000).toISOString() },
    { id: "3", name: "Get Lucky", artist: "Daft Punk", album: "Random Access Memories", albumImage: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937", playedAt: new Date(Date.now() - 55 * 60000).toISOString() },
    { id: "4", name: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", albumImage: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163", playedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: "5", name: "EARFQUAKE", artist: "Tyler, The Creator", album: "IGOR", albumImage: "https://i.scdn.co/image/ab67616d0000b273968fd4d60fb51c1e0a74e6b0", playedAt: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: "6", name: "Redbone", artist: "Childish Gambino", album: "Awaken, My Love!", albumImage: "https://i.scdn.co/image/ab67616d0000b273f8b0c0b0c0b0c0b0c0b0c0b0", playedAt: new Date(Date.now() - 6 * 3600000).toISOString() },
    { id: "7", name: "Starboy", artist: "The Weeknd", album: "Starboy", albumImage: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452", playedAt: new Date(Date.now() - 12 * 3600000).toISOString() },
    { id: "8", name: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", albumImage: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937", playedAt: new Date(Date.now() - 24 * 3600000).toISOString() },
]

const mockAlbums = [
    { id: "1", name: "After Hours", artist: "The Weeknd", image: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36", playCount: 156 },
    { id: "2", name: "Random Access Memories", artist: "Daft Punk", image: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937", playCount: 134 },
    { id: "3", name: "DAMN.", artist: "Kendrick Lamar", image: "https://i.scdn.co/image/ab67616d0000b273d28d2ebdedb220e479743797", playCount: 128 },
    { id: "4", name: "AM", artist: "Arctic Monkeys", image: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163", playCount: 112 },
    { id: "5", name: "IGOR", artist: "Tyler, The Creator", image: "https://i.scdn.co/image/ab67616d0000b273968fd4d60fb51c1e0a74e6b0", playCount: 98 },
    { id: "6", name: "Starboy", artist: "The Weeknd", image: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452", playCount: 87 },
]

interface DashboardPageProps {
    onLogout: () => void
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
    const [activeTab, setActiveTab] = useState<"artists" | "tracks">("artists")

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header
                user={{
                    name: mockUser.display_name,
                    email: mockUser.email,
                    image: mockUser.images?.[0]?.url,
                }}
                onLogout={onLogout}
            />

            <main className="container mx-auto px-4 py-8">
                {/* User Stats */}
                <UserStatsCards user={mockUser} />

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("artists")}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                            activeTab === "artists"
                                ? "bg-black text-white"
                                : "bg-gray-200 text-black hover:bg-gray-300"
                        }`}
                    >
                        Top Artistes
                    </button>
                    <button
                        onClick={() => setActiveTab("tracks")}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                            activeTab === "tracks"
                                ? "bg-black text-white"
                                : "bg-gray-200 text-black hover:bg-gray-300"
                        }`}
                    >
                        Top Titres
                    </button>
                </div>

                {/* Top Artists Grid */}
                {activeTab === "artists" && <TopArtistsGrid artists={mockArtists} />}

                {/* Top Tracks List */}
                {activeTab === "tracks" && <TopTracksList tracks={mockTracks} />}

                {/* Listening Stats */}
                <div className="mt-8">
                    <ListeningStats
                        totalMinutes={1847}
                        uniqueArtists={86}
                        uniqueTracks={342}
                        topGenre="Hip Hop"
                    />
                </div>

                {/* Genre Chart + Popularity Bars */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <GenreDonutChart genres={mockGenres} />
                    <PopularityBars artists={mockArtists} />
                </div>

                {/* Recently Played + Top Albums */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <RecentlyPlayed tracks={mockRecentTracks} />
                    <TopAlbums albums={mockAlbums} />
                </div>
            </main>

            <Footer />
        </div>
    )
}
