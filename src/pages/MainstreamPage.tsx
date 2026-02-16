import { Header } from "@/layout/header"
import { Footer } from "@/components/Footer"
import { MainstreamGauge } from "@/components/MainstreamGauge"
import { PopularityDistribution } from "@/components/PopularityDistribution"
import type { SpotifyData } from "@/App"

interface MainstreamPageProps {
    onLogout: () => void
    spotifyData: SpotifyData
}

const TIERS = [
    { min: 0, max: 19, label: "Explorateur des profondeurs", desc: "Tu ecoutes ce que personne ne connait. Respect.", color: "#8b5cf6" },
    { min: 20, max: 39, label: "Decouvreur indie", desc: "Tu es toujours en avance sur les tendances.", color: "#3b82f6" },
    { min: 40, max: 59, label: "Equilibriste musical", desc: "Un bon mix entre pepites cachees et hits.", color: "#22c55e" },
    { min: 60, max: 79, label: "Fan du Top 50", desc: "Tu sais ce qui marche et tu assumes.", color: "#f97316" },
    { min: 80, max: 100, label: "100% Mainstream", desc: "Les playlists editoriales sont faites pour toi.", color: "#ef4444" },
]

function getTier(score: number) {
    return TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[2]
}

export default function MainstreamPage({ onLogout, spotifyData }: MainstreamPageProps) {
    const { user, topArtists, topTracks } = spotifyData

    const artistPops = topArtists.map((a) => a.popularity)
    const trackPops = topTracks.map((t) => t.popularity ?? 50)

    const avgArtist = artistPops.length > 0 ? artistPops.reduce((a, b) => a + b, 0) / artistPops.length : 50
    const avgTrack = trackPops.length > 0 ? trackPops.reduce((a, b) => a + b, 0) / trackPops.length : 50

    const score = avgArtist * 0.6 + avgTrack * 0.4
    const tier = getTier(score)

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
                    <h1 className="text-3xl font-bold mb-2">How Mainstream Are You?</h1>
                    <p className="text-zinc-400">
                        Decouvre a quel point tes gouts sont populaires
                    </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Gauge */}
                    <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
                        <MainstreamGauge score={score} label={tier.label} />
                        <p className="text-center text-zinc-400 mt-4">{tier.desc}</p>
                    </div>

                    {/* Score breakdown */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-center">
                            <p className="text-3xl font-bold text-green-400">{Math.round(avgArtist)}</p>
                            <p className="text-zinc-400 text-sm mt-1">Popularite artistes</p>
                            <p className="text-zinc-600 text-xs mt-1">60% du score</p>
                        </div>
                        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-center">
                            <p className="text-3xl font-bold text-blue-400">{Math.round(avgTrack)}</p>
                            <p className="text-zinc-400 text-sm mt-1">Popularite titres</p>
                            <p className="text-zinc-600 text-xs mt-1">40% du score</p>
                        </div>
                    </div>

                    {/* Distribution */}
                    <PopularityDistribution
                        artistPopularities={artistPops}
                        trackPopularities={trackPops}
                    />

                    {/* All tiers */}
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <h3 className="text-lg font-bold mb-4 text-center">Les niveaux</h3>
                        <div className="space-y-3">
                            {TIERS.map((t) => (
                                <div
                                    key={t.label}
                                    className={`flex items-center gap-4 p-3 rounded-xl ${
                                        tier.label === t.label
                                            ? "bg-zinc-800 border border-zinc-600"
                                            : "opacity-60"
                                    }`}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: t.color }}
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{t.label}</p>
                                        <p className="text-zinc-500 text-xs">{t.desc}</p>
                                    </div>
                                    <span className="text-zinc-500 text-xs">
                                        {t.min}-{t.max}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
