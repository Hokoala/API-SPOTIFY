import { useEffect, useRef } from "react"
import gsap from "gsap"

interface SlideTopGenreProps {
    genres: { name: string; count: number }[]
    active: boolean
}

export function SlideTopGenre({ genres, active }: SlideTopGenreProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!active || !ref.current) return
        const els = ref.current.querySelectorAll(".anim")
        gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.15, duration: 0.6, ease: "back.out(1.5)" })
    }, [active])

    const topGenre = genres[0]?.name || "N/A"

    return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full text-center px-6 bg-gradient-to-br from-purple-900 via-black to-fuchsia-900">
            <p className="anim text-5xl mb-4">🎶</p>
            <p className="anim text-zinc-400 text-lg mb-2">Ton genre prefere</p>
            <h2 className="anim text-5xl md:text-7xl font-bold text-white capitalize mb-8">
                {topGenre}
            </h2>
            <div className="anim flex flex-wrap justify-center gap-3 max-w-md">
                {genres.slice(1, 6).map((g) => (
                    <span key={g.name} className="px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm capitalize">
                        {g.name}
                    </span>
                ))}
            </div>
        </div>
    )
}
