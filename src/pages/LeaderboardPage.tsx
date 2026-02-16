import { useState } from "react"
import { Header } from "@/layout/header"
import { Footer } from "@/components/Footer"
import { LeaderboardList, type ComparisonEntry } from "@/components/LeaderboardList"
import type { SpotifyData } from "@/App"

interface LeaderboardPageProps {
    onLogout: () => void
    spotifyData: SpotifyData
}

function getComparisons(): ComparisonEntry[] {
    try {
        const raw = localStorage.getItem("spotify_comparisons")
        if (!raw) return []
        return JSON.parse(raw) as ComparisonEntry[]
    } catch {
        return []
    }
}

function saveComparisons(entries: ComparisonEntry[]) {
    localStorage.setItem("spotify_comparisons", JSON.stringify(entries))
}

export default function LeaderboardPage({ onLogout, spotifyData }: LeaderboardPageProps) {
    const { user } = spotifyData
    const [entries, setEntries] = useState<ComparisonEntry[]>(() =>
        getComparisons().sort((a, b) => b.score - a.score)
    )

    const handleDelete = (friendName: string) => {
        const updated = entries.filter((e) => e.friendName !== friendName)
        setEntries(updated)
        saveComparisons(updated)
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
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Classement entre amis</h1>
                    <p className="text-zinc-400">
                        {entries.length > 0
                            ? `${entries.length} ami${entries.length > 1 ? "s" : ""} compare${entries.length > 1 ? "s" : ""}`
                            : "Tes comparaisons musicales apparaitront ici"}
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <LeaderboardList entries={entries} onDelete={handleDelete} />
                </div>
            </main>

            <Footer />
        </div>
    )
}
