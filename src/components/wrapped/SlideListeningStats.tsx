import { useEffect, useRef } from "react"
import gsap from "gsap"

interface SlideListeningStatsProps {
    totalMinutes: number
    uniqueArtists: number
    uniqueTracks: number
    active: boolean
}

export function SlideListeningStats({ totalMinutes, uniqueArtists, uniqueTracks, active }: SlideListeningStatsProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!active || !ref.current) return
        const counters = ref.current.querySelectorAll(".counter")
        counters.forEach((el) => {
            const target = Number(el.getAttribute("data-target"))
            gsap.fromTo(el, { innerText: 0 }, {
                innerText: target,
                duration: 2,
                ease: "power2.out",
                snap: { innerText: 1 },
                onUpdate: function () {
                    el.textContent = Math.round(Number(gsap.getProperty(el, "innerText") || 0)).toLocaleString("fr-FR")
                },
            })
        })
        const els = ref.current.querySelectorAll(".anim")
        gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.7, ease: "power3.out" })
    }, [active])

    return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full text-center px-6 bg-gradient-to-br from-blue-900 via-black to-cyan-900">
            <p className="anim text-5xl mb-4">📊</p>
            <p className="anim text-zinc-400 text-lg mb-8">Tes stats d'ecoute</p>

            <div className="anim grid grid-cols-1 gap-6 max-w-sm w-full">
                <div className="bg-white/10 rounded-2xl p-6">
                    <p className="counter text-4xl font-bold text-blue-400" data-target={totalMinutes}>0</p>
                    <p className="text-zinc-300 mt-1">minutes ecoutees</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                    <p className="counter text-4xl font-bold text-green-400" data-target={uniqueArtists}>0</p>
                    <p className="text-zinc-300 mt-1">artistes differents</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                    <p className="counter text-4xl font-bold text-purple-400" data-target={uniqueTracks}>0</p>
                    <p className="text-zinc-300 mt-1">titres differents</p>
                </div>
            </div>
        </div>
    )
}
