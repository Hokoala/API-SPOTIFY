import { useEffect, useRef } from "react"
import gsap from "gsap"

interface SlideMoodProps {
    energy: number
    danceability: number
    valence: number
    active: boolean
}

function getMoodEmoji(valence: number) {
    if (valence >= 0.7) return "😄"
    if (valence >= 0.5) return "😊"
    if (valence >= 0.3) return "😐"
    return "😢"
}

function getMoodLabel(valence: number) {
    if (valence >= 0.7) return "Joyeux et positif"
    if (valence >= 0.5) return "Equilibre"
    if (valence >= 0.3) return "Melancolique"
    return "Sombre et introspectif"
}

export function SlideMood({ energy, danceability, valence, active }: SlideMoodProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!active || !ref.current) return
        const bars = ref.current.querySelectorAll(".mood-bar")
        bars.forEach((bar) => {
            const target = bar.getAttribute("data-value") || "0"
            gsap.fromTo(bar, { width: "0%" }, { width: `${Number(target)}%`, duration: 1.5, ease: "power3.out" })
        })
        const els = ref.current.querySelectorAll(".anim")
        gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power3.out" })
    }, [active])

    const metrics = [
        { label: "Energie", value: Math.round(energy * 100), color: "bg-red-500" },
        { label: "Dansabilite", value: Math.round(danceability * 100), color: "bg-blue-500" },
        { label: "Positivite", value: Math.round(valence * 100), color: "bg-yellow-500" },
    ]

    return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full text-center px-6 bg-gradient-to-br from-indigo-900 via-black to-violet-900">
            <p className="anim text-6xl mb-4">{getMoodEmoji(valence)}</p>
            <p className="anim text-zinc-400 text-lg mb-2">Ton mood musical</p>
            <h2 className="anim text-3xl font-bold text-white mb-8">{getMoodLabel(valence)}</h2>

            <div className="anim w-full max-w-sm space-y-4">
                {metrics.map((m) => (
                    <div key={m.label}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-zinc-300">{m.label}</span>
                            <span className="text-white font-semibold">{m.value}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                            <div className={`mood-bar ${m.color} h-3 rounded-full`} data-value={m.value} style={{ width: 0 }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
