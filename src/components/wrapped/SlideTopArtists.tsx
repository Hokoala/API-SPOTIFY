import { useEffect, useRef } from "react"
import gsap from "gsap"
import type { Artist } from "@/App"

interface SlideTopArtistsProps {
    artists: Artist[]
    active: boolean
}

export function SlideTopArtists({ artists, active }: SlideTopArtistsProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!active || !ref.current) return
        const items = ref.current.querySelectorAll(".artist-item")
        // Reveal from #5 to #1 (reverse order)
        gsap.fromTo(items, { opacity: 0, x: -60 }, {
            opacity: 1,
            x: 0,
            stagger: 0.3,
            duration: 0.6,
            ease: "power3.out",
        })
    }, [active])

    const top5 = artists.slice(0, 5).reverse() // Show 5→1

    return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full text-center px-6 bg-gradient-to-br from-orange-900 via-black to-red-900">
            <p className="text-zinc-400 text-lg mb-6">Tes artistes preferes</p>

            <div className="space-y-3 max-w-sm w-full">
                {top5.map((artist, i) => {
                    const rank = 5 - i
                    const isFirst = rank === 1
                    return (
                        <div
                            key={artist.id}
                            className={`artist-item flex items-center gap-4 p-3 rounded-xl ${
                                isFirst ? "bg-yellow-500/20 border border-yellow-500/50 scale-105" : "bg-white/10"
                            }`}
                        >
                            <span className={`text-2xl font-bold ${isFirst ? "text-yellow-400" : "text-zinc-400"} w-8`}>
                                #{rank}
                            </span>
                            {artist.images[0] ? (
                                <img src={artist.images[0].url} alt={artist.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <span className="font-bold">{artist.name[0]}</span>
                                </div>
                            )}
                            <p className={`font-semibold ${isFirst ? "text-yellow-300 text-lg" : "text-white"}`}>
                                {artist.name}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
