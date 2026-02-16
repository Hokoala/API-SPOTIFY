import { useEffect, useRef, useCallback } from "react"
import gsap from "gsap"
import type { Artist, Track } from "@/App"

interface SlideSummaryProps {
    userName: string
    topArtist: Artist | null
    topTrack: Track | null
    topGenre: string
    totalMinutes: number
    active: boolean
}

export function SlideSummary({ userName, topArtist, topTrack, topGenre, totalMinutes, active }: SlideSummaryProps) {
    const ref = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!active || !ref.current) return
        const els = ref.current.querySelectorAll(".anim")
        gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power3.out" })
    }, [active])

    const exportPNG = useCallback(async () => {
        if (!cardRef.current) return
        try {
            const { default: html2canvas } = await import("html2canvas")
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: "#000",
                scale: 2,
            })
            const link = document.createElement("a")
            link.download = `wrapped-${userName}.png`
            link.href = canvas.toDataURL()
            link.click()
        } catch {
            // html2canvas not available - fallback ignored
        }
    }, [userName])

    return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full text-center px-6 bg-gradient-to-br from-green-900 via-black to-emerald-900">
            <div ref={cardRef} className="anim bg-zinc-900/80 rounded-2xl p-8 max-w-sm w-full border border-zinc-700">
                <h2 className="text-2xl font-bold text-white mb-6">Resume de {userName}</h2>

                <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                        {topArtist?.images[0] && (
                            <img src={topArtist.images[0].url} alt="" className="w-10 h-10 rounded-full object-cover" />
                        )}
                        <div>
                            <p className="text-zinc-400 text-xs">Artiste #1</p>
                            <p className="text-white font-semibold">{topArtist?.name || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {topTrack?.album.images[0] && (
                            <img src={topTrack.album.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                            <p className="text-zinc-400 text-xs">Titre #1</p>
                            <p className="text-white font-semibold">{topTrack?.name || "N/A"}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-zinc-400 text-xs">Genre prefere</p>
                        <p className="text-white font-semibold capitalize">{topGenre}</p>
                    </div>

                    <div>
                        <p className="text-zinc-400 text-xs">Temps d'ecoute</p>
                        <p className="text-white font-semibold">{totalMinutes.toLocaleString("fr-FR")} minutes</p>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-700">
                    <p className="text-zinc-500 text-xs">Spotify App Wrapped</p>
                </div>
            </div>

            <button
                onClick={exportPNG}
                className="anim mt-6 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full transition-colors"
            >
                Exporter en PNG
            </button>
        </div>
    )
}
