import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TopArtistsPodium } from "./TopArtistsPodium";

interface UserProfile {
    display_name: string;
    email: string;
    images: { url: string }[];
    followers: { total: number };
    country: string;
    product: string;
}

interface TopArtist {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
    popularity: number;
}

interface TopTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    duration_ms: number;
}

interface DashboardProps {
    accessToken?: string;
    onLogout: () => void;
    useMockData?: boolean;
}

// Données mockées pour les tests
const mockUser: UserProfile = {
    display_name: "Jean Dupont",
    email: "jean.dupont@email.com",
    images: [{ url: "https://i.pravatar.cc/150?img=68" }],
    followers: { total: 142 },
    country: "FR",
    product: "premium",
};

const mockArtists: TopArtist[] = [
    { id: "1", name: "Daft Punk", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eba7bfd7835b5c1eee0c95fa6e" }], genres: ["electronic", "french house"], popularity: 85 },
    { id: "2", name: "The Weeknd", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb" }], genres: ["pop", "r&b"], popularity: 95 },
    { id: "3", name: "Kendrick Lamar", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022" }], genres: ["hip hop", "rap"], popularity: 92 },
    { id: "4", name: "Arctic Monkeys", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" }], genres: ["rock", "indie"], popularity: 88 },
    { id: "5", name: "Tyler, The Creator", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb8278b782cbb5a3963db88ada" }], genres: ["hip hop", "alternative"], popularity: 89 },
    { id: "6", name: "Tame Impala", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb5765658c4777dc8e4c4a6a6a" }], genres: ["psychedelic", "indie"], popularity: 82 },
    { id: "7", name: "Frank Ocean", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb5ac6a95b0d8e9a7a9b1c4d5e" }], genres: ["r&b", "soul"], popularity: 86 },
    { id: "8", name: "Stromae", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb6b0c1f0a9d1d0a4a8a4a4a4a" }], genres: ["hip hop", "electronic"], popularity: 80 },
    { id: "9", name: "Mac DeMarco", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7c0c1f0a9d1d0a4a8a4a4a4b" }], genres: ["indie", "rock"], popularity: 75 },
    { id: "10", name: "Billie Eilish", images: [{ url: "https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf" }], genres: ["pop", "electropop"], popularity: 94 },
];

const mockTracks: TopTrack[] = [
    { id: "1", name: "Blinding Lights", artists: [{ name: "The Weeknd" }], album: { name: "After Hours", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36" }] }, duration_ms: 200040 },
    { id: "2", name: "HUMBLE.", artists: [{ name: "Kendrick Lamar" }], album: { name: "DAMN.", images: [{ url: "https://i.scdn.co/image/ab67616d0000b273d28d2ebdedb220e479743797" }] }, duration_ms: 177000 },
    { id: "3", name: "Do I Wanna Know?", artists: [{ name: "Arctic Monkeys" }], album: { name: "AM", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163" }] }, duration_ms: 272394 },
    { id: "4", name: "Get Lucky", artists: [{ name: "Daft Punk" }, { name: "Pharrell Williams" }], album: { name: "Random Access Memories", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937" }] }, duration_ms: 369626 },
    { id: "5", name: "EARFQUAKE", artists: [{ name: "Tyler, The Creator" }], album: { name: "IGOR", images: [{ url: "https://i.scdn.co/image/ab67616d0000b273968fd4d60fb51c1e0a74e6b0" }] }, duration_ms: 190067 },
    { id: "6", name: "The Less I Know The Better", artists: [{ name: "Tame Impala" }], album: { name: "Currents", images: [{ url: "https://i.scdn.co/image/ab67616d0000b27379e82d7a7da8a8e9b8e9b8e9" }] }, duration_ms: 216320 },
    { id: "7", name: "Pink + White", artists: [{ name: "Frank Ocean" }], album: { name: "Blonde", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2737c0c1f0a9d1d0a4a8a4a4a4c" }] }, duration_ms: 183867 },
    { id: "8", name: "Papaoutai", artists: [{ name: "Stromae" }], album: { name: "Racine Carrée", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2737d0c1f0a9d1d0a4a8a4a4a4d" }] }, duration_ms: 234733 },
    { id: "9", name: "Chamber of Reflection", artists: [{ name: "Mac DeMarco" }], album: { name: "Salad Days", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738e0c1f0a9d1d0a4a8a4a4a4e" }] }, duration_ms: 240000 },
    { id: "10", name: "bad guy", artists: [{ name: "Billie Eilish" }], album: { name: "WHEN WE ALL FALL ASLEEP", images: [{ url: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd73182f710c5d" }] }, duration_ms: 194088 },
];

function Dashboard({ accessToken, onLogout, useMockData = false }: DashboardProps) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
    const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
    const [activeTab, setActiveTab] = useState<"artists" | "tracks">("artists");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mode mock pour les tests
        if (useMockData || !accessToken) {
            setUser(mockUser);
            setTopArtists(mockArtists);
            setTopTracks(mockTracks);
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            try {
                // Fetch user profile
                const userRes = await fetch("https://api.spotify.com/v1/me", { headers });
                const userData = await userRes.json();
                setUser(userData);

                // Fetch top artists
                const artistsRes = await fetch(
                    "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term",
                    { headers }
                );
                const artistsData = await artistsRes.json();
                setTopArtists(artistsData.items || []);

                // Fetch top tracks
                const tracksRes = await fetch(
                    "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=medium_term",
                    { headers }
                );
                const tracksData = await tracksRes.json();
                setTopTracks(tracksData.items || []);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
                // Fallback aux données mock en cas d'erreur
                setUser(mockUser);
                setTopArtists(mockArtists);
                setTopTracks(mockTracks);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [accessToken, useMockData]);

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-400">Chargement de vos données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="bg-zinc-900 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold">Spotify Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/search"
                            className="px-4 py-2 text-sm bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </svg>
                            Recherche
                        </Link>
                        {user && (
                            <div className="flex items-center gap-3">
                                {user.images?.[0]?.url ? (
                                    <img
                                        src={user.images[0].url}
                                        alt={user.display_name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                        <span className="text-lg font-bold">{user.display_name?.[0]}</span>
                                    </div>
                                )}
                                <span className="text-sm font-medium hidden sm:block">{user.display_name}</span>
                            </div>
                        )}
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* User Stats */}
                {user && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-zinc-900 rounded-lg p-6 border border-white/10">
                            <div className="flex items-center gap-4">
                                {user.images?.[0]?.url ? (
                                    <img
                                        src={user.images[0].url}
                                        alt={user.display_name}
                                        className="w-16 h-16 rounded-full"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center">
                                        <span className="text-2xl font-bold">{user.display_name?.[0]}</span>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-bold">{user.display_name}</h2>
                                    <p className="text-gray-400 text-sm">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-lg p-6 border border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Followers</p>
                            <p className="text-3xl font-bold text-green-500">{user.followers?.total || 0}</p>
                        </div>

                        <div className="bg-zinc-900 rounded-lg p-6 border border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Abonnement</p>
                            <p className="text-3xl font-bold capitalize">{user.product || "Free"}</p>
                            <p className="text-gray-400 text-sm">{user.country}</p>
                        </div>
                    </div>
                )}

                {/* Top 5 Artists Podium */}
                {topArtists.length >= 5 && (
                    <div className="mb-8">
                        <TopArtistsPodium artists={topArtists} />
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("artists")}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                            activeTab === "artists"
                                ? "bg-green-500 text-black"
                                : "bg-zinc-800 text-white hover:bg-zinc-700"
                        }`}
                    >
                        Top Artistes
                    </button>
                    <button
                        onClick={() => setActiveTab("tracks")}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                            activeTab === "tracks"
                                ? "bg-green-500 text-black"
                                : "bg-zinc-800 text-white hover:bg-zinc-700"
                        }`}
                    >
                        Top Titres
                    </button>
                </div>

                {/* Top Artists */}
                {activeTab === "artists" && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {topArtists.map((artist, index) => (
                            <div
                                key={artist.id}
                                className="bg-zinc-900 rounded-lg p-4 border border-white/10 hover:bg-zinc-800 transition-all group"
                            >
                                <div className="relative mb-4">
                                    <span className="absolute -top-2 -left-2 w-8 h-8 bg-green-500 text-black font-bold rounded-full flex items-center justify-center text-sm">
                                        {index + 1}
                                    </span>
                                    {artist.images?.[0]?.url ? (
                                        <img
                                            src={artist.images[0].url}
                                            alt={artist.name}
                                            className="w-full aspect-square object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full aspect-square bg-zinc-700 rounded-full flex items-center justify-center">
                                            <span className="text-4xl font-bold">{artist.name[0]}</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-center truncate">{artist.name}</h3>
                                <p className="text-gray-400 text-sm text-center truncate">
                                    {artist.genres?.[0] || "Artiste"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Top Tracks */}
                {activeTab === "tracks" && (
                    <div className="bg-zinc-900 rounded-lg border border-white/10 overflow-hidden">
                        {topTracks.map((track, index) => (
                            <div
                                key={track.id}
                                className="flex items-center gap-4 p-4 hover:bg-zinc-800 transition-all border-b border-white/5 last:border-b-0"
                            >
                                <span className="w-8 text-center text-gray-400 font-bold">{index + 1}</span>
                                {track.album.images?.[0]?.url ? (
                                    <img
                                        src={track.album.images[0].url}
                                        alt={track.album.name}
                                        className="w-12 h-12 rounded"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-zinc-700 rounded flex items-center justify-center">
                                        <span className="text-lg font-bold">{track.name[0]}</span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{track.name}</h3>
                                    <p className="text-gray-400 text-sm truncate">
                                        {track.artists.map((a) => a.name).join(", ")}
                                    </p>
                                </div>
                                <span className="text-gray-400 text-sm hidden sm:block">{track.album.name}</span>
                                <span className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty States */}
                {activeTab === "artists" && topArtists.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Aucun artiste trouvé. Écoutez plus de musique !</p>
                    </div>
                )}
                {activeTab === "tracks" && topTracks.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Aucun titre trouvé. Écoutez plus de musique !</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
