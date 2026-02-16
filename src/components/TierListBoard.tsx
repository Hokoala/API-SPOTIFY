import { useState, useRef, useCallback, forwardRef } from "react"
import type { Track } from "@/App"

interface TierListBoardProps {
    tracks: Track[]
}

interface TierConfig {
    id: string
    label: string
    color: string
    bg: string
}

const TIERS: TierConfig[] = [
    { id: "S", label: "S", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
    { id: "A", label: "A", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
    { id: "B", label: "B", color: "#eab308", bg: "rgba(234,179,8,0.15)" },
    { id: "C", label: "C", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
    { id: "D", label: "D", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
]

type TierMap = Record<string, Track[]>

export const TierListBoard = forwardRef<HTMLDivElement, TierListBoardProps>(({ tracks }, boardRef) => {
    const [tiers, setTiers] = useState<TierMap>(() => {
        const map: TierMap = { pool: [...tracks] }
        for (const t of TIERS) map[t.id] = []
        return map
    })

    const [dragItem, setDragItem] = useState<{ trackId: string; from: string } | null>(null)
    const [selectedItem, setSelectedItem] = useState<{ trackId: string; from: string } | null>(null)
    const dragOverTier = useRef<string | null>(null)

    const moveTrack = useCallback(
        (trackId: string, from: string, to: string) => {
            if (from === to) return
            setTiers((prev) => {
                const track = prev[from].find((t) => t.id === trackId)
                if (!track) return prev
                return {
                    ...prev,
                    [from]: prev[from].filter((t) => t.id !== trackId),
                    [to]: [...prev[to], track],
                }
            })
        },
        []
    )

    const handleReset = () => {
        const map: TierMap = { pool: [...tracks] }
        for (const t of TIERS) map[t.id] = []
        setTiers(map)
        setSelectedItem(null)
    }

    // Desktop drag handlers
    const handleDragStart = (trackId: string, from: string) => {
        setDragItem({ trackId, from })
    }

    const handleDragOver = (e: React.DragEvent, tierId: string) => {
        e.preventDefault()
        dragOverTier.current = tierId
    }

    const handleDrop = (e: React.DragEvent, toTier: string) => {
        e.preventDefault()
        if (dragItem) {
            moveTrack(dragItem.trackId, dragItem.from, toTier)
            setDragItem(null)
        }
        dragOverTier.current = null
    }

    // Mobile tap-to-select
    const handleTap = (trackId: string, from: string) => {
        if (selectedItem?.trackId === trackId) {
            setSelectedItem(null)
        } else {
            setSelectedItem({ trackId, from })
        }
    }

    const handleTierTap = (tierId: string) => {
        if (selectedItem) {
            moveTrack(selectedItem.trackId, selectedItem.from, tierId)
            setSelectedItem(null)
        }
    }

    const renderTrackItem = (track: Track, tierId: string) => {
        const albumImg = track.album.images?.[track.album.images.length - 1]?.url
        const isSelected = selectedItem?.trackId === track.id
        return (
            <div
                key={track.id}
                draggable
                onDragStart={() => handleDragStart(track.id, tierId)}
                onClick={() => handleTap(track.id, tierId)}
                className={`flex items-center gap-2 bg-zinc-800 rounded-lg p-1.5 cursor-grab active:cursor-grabbing select-none shrink-0 transition-all ${
                    isSelected ? "ring-2 ring-green-500 bg-zinc-700" : "hover:bg-zinc-700"
                }`}
                style={{ maxWidth: "180px" }}
            >
                {albumImg ? (
                    <img
                        src={albumImg}
                        alt=""
                        className="w-10 h-10 rounded object-cover shrink-0"
                        draggable={false}
                    />
                ) : (
                    <div className="w-10 h-10 rounded bg-zinc-600 shrink-0" />
                )}
                <span className="text-xs text-white truncate">{track.name}</span>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                >
                    Reinitialiser
                </button>
            </div>

            <div ref={boardRef} className="space-y-2 bg-zinc-950 rounded-2xl p-4">
                {/* Tier rows */}
                {TIERS.map((tier) => (
                    <div
                        key={tier.id}
                        className="flex rounded-xl overflow-hidden min-h-[64px]"
                        onDragOver={(e) => handleDragOver(e, tier.id)}
                        onDrop={(e) => handleDrop(e, tier.id)}
                        onClick={() => handleTierTap(tier.id)}
                    >
                        <div
                            className="w-16 shrink-0 flex items-center justify-center font-bold text-2xl"
                            style={{ backgroundColor: tier.color }}
                        >
                            {tier.label}
                        </div>
                        <div
                            className="flex-1 flex flex-wrap gap-2 p-2 items-start"
                            style={{ backgroundColor: tier.bg, minHeight: "64px" }}
                        >
                            {tiers[tier.id].map((t) => renderTrackItem(t, tier.id))}
                            {tiers[tier.id].length === 0 && (
                                <span className="text-zinc-600 text-xs self-center px-2">
                                    Glisse ou clique pour ajouter
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Pool */}
                <div
                    className="mt-4 rounded-xl bg-zinc-900 p-4"
                    onDragOver={(e) => handleDragOver(e, "pool")}
                    onDrop={(e) => handleDrop(e, "pool")}
                    onClick={() => handleTierTap("pool")}
                >
                    <p className="text-zinc-500 text-sm mb-3 font-medium">Non classe</p>
                    <div className="flex flex-wrap gap-2">
                        {tiers.pool.map((t) => renderTrackItem(t, "pool"))}
                        {tiers.pool.length === 0 && (
                            <span className="text-zinc-600 text-xs">
                                Tous les titres sont classes !
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
})

TierListBoard.displayName = "TierListBoard"
