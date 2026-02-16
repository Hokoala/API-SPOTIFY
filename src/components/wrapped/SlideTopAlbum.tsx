import { useEffect, useRef } from "react"
import gsap from "gsap"
import type { Track } from "@/App"

interface SlideTopAlbumProps {
    tracks: Track[]
    active: boolean
}

export function SlideTopAlbum({ tracks, active }: SlideTopAlbumProps) {
    const ref = useRef<HTMLDivElement>(null)

    // Compute top album from tracks
    const albumCounts: Record<string, { name: string; artist: string; image: string; count: number }> = {}
    tracks.forEach((t) => {
        const key = t.album.name
        if (!albumCounts[key]) {
            albumCounts[key] = {
                name: t.album.name,
                artist: t.artists.map((a) => a.name).join(", "),
                image: t.album.images[0]?.url || "",
                count: 0,
            }
        }
        albumCounts[key].count++
    })
    const topAlbums = Object.values(albumCounts).sort((a, b) => b.count - a.count)
    const topAlbum = topAlbums[0]

    useEffect(() => {
        if (!active || !ref.current) return
        const els = ref.current.querySelectorAll(".anim")
        gsap.fromTo(els, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 0.7, ease: "back.out(1.5)" })
    }, [active])

    if (!topAlbum) return null

    return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full text-center px-6 bg-gradient-to-br from-amber-900 via-black to-yellow-900">
            <p className="anim text-zinc-400 text-lg mb-4">Ton album prefere</p>
            {topAlbum.image && (
                <img
                    src={topAlbum.image}
                    alt={topAlbum.name}
                    className="anim w-48 h-48 rounded-2xl object-cover shadow-2xl mb-6"
                />
            )}
            <h2 className="anim text-3xl font-bold text-white mb-2">{topAlbum.name}</h2>
            <p className="anim text-zinc-300">{topAlbum.artist}</p>
            <p className="anim text-amber-400 mt-4 text-sm font-semibold">
                {topAlbum.count} titre{topAlbum.count > 1 ? "s" : ""} dans ton Top
            </p>
        </div>
    )
}
