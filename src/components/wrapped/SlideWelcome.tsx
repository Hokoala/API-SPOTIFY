import { useEffect, useRef } from "react"
import gsap from "gsap"

interface SlideWelcomeProps {
    userName: string
    active: boolean
}

export function SlideWelcome({ userName, active }: SlideWelcomeProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!active || !ref.current) return
        const els = ref.current.querySelectorAll(".anim")
        gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power3.out" })
    }, [active])

    return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full text-center px-6 bg-gradient-to-br from-green-900 via-black to-emerald-900">
            <p className="anim text-6xl mb-6">🎵</p>
            <h1 className="anim text-4xl md:text-6xl font-bold text-white mb-4">
                Ton Wrapped
            </h1>
            <p className="anim text-xl text-green-300">
                Salut {userName} ! Voici ton resume musical.
            </p>
            <p className="anim text-zinc-400 mt-8 text-sm">Clique pour continuer</p>
        </div>
    )
}
