import { useState } from "react"
import type { SpotifyData } from "@/App"

interface MusicCompatibilityProps {
    spotifyData: SpotifyData
}

export function MusicCompatibility({ spotifyData }: MusicCompatibilityProps) {
    const [copied, setCopied] = useState(false)

    const { user, topArtists, topTracks } = spotifyData

    // Collect genres from artists
    const genreCounts: Record<string, number> = {}
    topArtists.forEach((artist) => {
        artist.genres.forEach((genre) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
    })
    const genres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name]) => name)

    const handleShare = async () => {
        const payload = {
            userName: user?.display_name || "Utilisateur",
            userImage: user?.images?.[0]?.url || "",
            artistIds: topArtists.slice(0, 15).map((a) => a.id),
            artistNames: topArtists.slice(0, 15).map((a) => a.name),
            trackIds: topTracks.slice(0, 15).map((t) => t.id),
            trackNames: topTracks.slice(0, 15).map((t) => t.name),
            genres,
        }

        const encoded = btoa(encodeURIComponent(JSON.stringify(payload)))
        const url = `${window.location.origin}/compare?data=${encoded}`

        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        } catch {
            // Fallback: select text in a temporary input
            const input = document.createElement("input")
            input.value = url
            document.body.appendChild(input)
            input.select()
            document.execCommand("copy")
            document.body.removeChild(input)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        }
    }

    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Compatibilite musicale</h2>
                        <p className="text-zinc-400 text-sm">
                            Compare tes gouts musicaux avec un ami
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleShare}
                    className={`px-6 py-3 rounded-full font-bold transition-all duration-200 flex items-center gap-2 ${
                        copied
                            ? "bg-green-500 text-black"
                            : "bg-purple-500 hover:bg-purple-400 text-white"
                    }`}
                >
                    {copied ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Lien copie !
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Partager mon profil musical
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
