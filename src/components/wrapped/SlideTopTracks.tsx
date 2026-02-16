import { useEffect, useRef } from "react"
import gsap from "gsap"
import type { Track } from "@/App"

interface SlideTopTracksProps {
    tracks: Track[]
    active: boolean
}

export function SlideTopTracks({ tracks, active }: SlideTopTracksProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!active || !ref.current) return
        const items = ref.current.querySelectorAll(".track-item")
        gsap.fromTo(items, { opacity: 0, y: 30 }, {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.5,
            ease: "power3.out",
        })
    }, [active])

    const top5 = tracks.slice(0, 5)

    return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full text-center px-6 bg-gradient-to-br from-pink-900 via-black to-rose-900">
            <p className="text-zinc-400 text-lg mb-6">Tes titres preferes</p>

            <div className="space-y-3 max-w-md w-full">
                {top5.map((track, i) => (
                    <div
                        key={track.id}
                        className={`track-item flex items-center gap-4 p-3 rounded-xl ${
                            i === 0 ? "bg-pink-500/20 border border-pink-500/50" : "bg-white/10"
                        }`}
                    >
                        <span className={`text-xl font-bold ${i === 0 ? "text-pink-400" : "text-zinc-400"} w-8`}>
                            #{i + 1}
                        </span>
                        {track.album.images[0] && (
                            <img
                                src={track.album.images[0].url}
                                alt={track.name}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                        )}
                        <div className="text-left flex-1 min-w-0">
                            <p className={`font-semibold truncate ${i === 0 ? "text-pink-300" : "text-white"}`}>
                                {track.name}
                            </p>
                            <p className="text-zinc-400 text-sm truncate">
                                {track.artists.map((a) => a.name).join(", ")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
