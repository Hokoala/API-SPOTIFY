import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import { Header } from "@/layout/header"
import { Footer } from "@/components/Footer"
import { TierListBoard } from "@/components/TierListBoard"
import type { SpotifyData } from "@/App"

interface TierListPageProps {
    onLogout: () => void
    spotifyData: SpotifyData
}

export default function TierListPage({ onLogout, spotifyData }: TierListPageProps) {
    const { user, topTracks } = spotifyData
    const boardRef = useRef<HTMLDivElement>(null)
    const [exporting, setExporting] = useState(false)

    const handleExport = async () => {
        if (!boardRef.current) return
        setExporting(true)
        try {
            await new Promise((r) => setTimeout(r, 100))
            const dataUrl = await toPng(boardRef.current, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: "#09090b",
            })
            const link = document.createElement("a")
            link.download = `tier-list-${user?.display_name || "user"}.png`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error("Export error:", err)
        } finally {
            setExporting(false)
        }
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
                    <h1 className="text-3xl font-bold mb-2">Tier List</h1>
                    <p className="text-zinc-400">
                        Classe tes titres preferes du S-tier au D-tier
                    </p>
                    <p className="text-zinc-600 text-sm mt-1">
                        Glisse les titres (desktop) ou clique pour selectionner puis clique sur un tier (mobile)
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {exporting ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                                    Export en cours...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Exporter en PNG
                                </>
                            )}
                        </button>
                    </div>

                    <TierListBoard ref={boardRef} tracks={topTracks} />
                </div>
            </main>

            <Footer />
        </div>
    )
}
