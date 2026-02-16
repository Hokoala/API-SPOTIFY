import { useEffect, useState } from "react"
import { Header } from "@/layout/header"
import { Footer } from "@/components/Footer"
import { TimeMachineArtists } from "@/components/TimeMachineArtists"
import { TimeMachineGenres } from "@/components/TimeMachineGenres"
import { TimeMachineTracks } from "@/components/TimeMachineTracks"
import type { SpotifyData, Artist, Track } from "@/App"

interface TimeMachinePageProps {
    onLogout: () => void
    spotifyData: SpotifyData
    token: string
}

type Tab = "artists" | "tracks" | "genres"

export default function TimeMachinePage({ onLogout, spotifyData, token }: TimeMachinePageProps) {
    const { user } = spotifyData
    const [tab, setTab] = useState<Tab>("artists")
    const [loading, setLoading] = useState(true)
    const [longTermArtists, setLongTermArtists] = useState<Artist[]>([])
    const [shortTermArtists, setShortTermArtists] = useState<Artist[]>([])
    const [longTermTracks, setLongTermTracks] = useState<Track[]>([])
    const [shortTermTracks, setShortTermTracks] = useState<Track[]>([])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const headers = { Authorization: `Bearer ${token}` }
                const [ltArtists, stArtists, ltTracks, stTracks] = await Promise.all([
                    fetch("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term", { headers }),
                    fetch("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term", { headers }),
                    fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term", { headers }),
                    fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term", { headers }),
                ])

                const [ltAData, stAData, ltTData, stTData] = await Promise.all([
                    ltArtists.ok ? ltArtists.json() : { items: [] },
                    stArtists.ok ? stArtists.json() : { items: [] },
                    ltTracks.ok ? ltTracks.json() : { items: [] },
                    stTracks.ok ? stTracks.json() : { items: [] },
                ])

                setLongTermArtists(ltAData.items || [])
                setShortTermArtists(stAData.items || [])
                setLongTermTracks(ltTData.items || [])
                setShortTermTracks(stTData.items || [])
            } catch (err) {
                console.error("Time Machine fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token])

    const TABS: { id: Tab; label: string }[] = [
        { id: "artists", label: "Artistes" },
        { id: "tracks", label: "Titres" },
        { id: "genres", label: "Genres" },
    ]

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
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Time Machine</h1>
                    <p className="text-zinc-400">
                        Compare tes gouts des 4 dernieres semaines vs depuis toujours
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-3 text-sm">
                        <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">
                            Long terme
                        </span>
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                            4 dernieres semaines
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-8 justify-center">
                            {TABS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                        tab === t.id
                                            ? "bg-green-500 text-black"
                                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        {tab === "artists" && (
                            <TimeMachineArtists
                                longTermArtists={longTermArtists}
                                shortTermArtists={shortTermArtists}
                            />
                        )}
                        {tab === "tracks" && (
                            <TimeMachineTracks
                                longTermTracks={longTermTracks}
                                shortTermTracks={shortTermTracks}
                            />
                        )}
                        {tab === "genres" && (
                            <TimeMachineGenres
                                longTermArtists={longTermArtists}
                                shortTermArtists={shortTermArtists}
                            />
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
