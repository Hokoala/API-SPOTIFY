import type { Track } from "@/App"

interface TrackDiff {
    track: Track
    status: "new" | "gone" | "up" | "down" | "stable"
    oldRank?: number
    newRank?: number
    diff?: number
}

interface TimeMachineTracksProps {
    longTermTracks: Track[]
    shortTermTracks: Track[]
}

function computeTrackDiffs(longTerm: Track[], shortTerm: Track[]): TrackDiff[] {
    const longMap = new Map(longTerm.map((t, i) => [t.id, i]))
    const shortMap = new Map(shortTerm.map((t, i) => [t.id, i]))

    const diffs: TrackDiff[] = []

    for (let i = 0; i < shortTerm.length; i++) {
        const t = shortTerm[i]
        const oldIdx = longMap.get(t.id)
        if (oldIdx === undefined) {
            diffs.push({ track: t, status: "new", newRank: i + 1 })
        } else {
            const diff = oldIdx - i
            diffs.push({
                track: t,
                status: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
                oldRank: oldIdx + 1,
                newRank: i + 1,
                diff,
            })
        }
    }

    for (let i = 0; i < longTerm.length; i++) {
        const t = longTerm[i]
        if (!shortMap.has(t.id)) {
            diffs.push({ track: t, status: "gone", oldRank: i + 1 })
        }
    }

    return diffs
}

const STATUS_COLORS: Record<string, string> = {
    new: "#22c55e",
    gone: "#ef4444",
    up: "#22c55e",
    down: "#f97316",
    stable: "#71717a",
}

const STATUS_ICONS: Record<string, string> = {
    new: "+",
    gone: "-",
    up: "\u2191",
    down: "\u2193",
    stable: "=",
}

export function TimeMachineTracks({ longTermTracks, shortTermTracks }: TimeMachineTracksProps) {
    const diffs = computeTrackDiffs(longTermTracks, shortTermTracks)

    const newTracks = diffs.filter((d) => d.status === "new")
    const goneTracks = diffs.filter((d) => d.status === "gone")
    const movers = diffs
        .filter((d) => d.status === "up" || d.status === "down")
        .sort((a, b) => Math.abs(b.diff || 0) - Math.abs(a.diff || 0))
        .slice(0, 10)

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
                    <p className="text-3xl font-bold text-green-400">{newTracks.length}</p>
                    <p className="text-zinc-400 text-sm mt-1">Nouveaux titres</p>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
                    <p className="text-3xl font-bold text-red-400">{goneTracks.length}</p>
                    <p className="text-zinc-400 text-sm mt-1">Titres perdus</p>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
                    <p className="text-3xl font-bold text-blue-400">
                        {diffs.filter((d) => d.status === "stable").length}
                    </p>
                    <p className="text-zinc-400 text-sm mt-1">Titres stables</p>
                </div>
            </div>

            {/* Biggest movers */}
            {movers.length > 0 && (
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-lg font-bold mb-4">Plus gros mouvements</h3>
                    <div className="space-y-3">
                        {movers.map((d) => {
                            const color = STATUS_COLORS[d.status]
                            const icon = STATUS_ICONS[d.status]
                            const albumImg = d.track.album.images?.[d.track.album.images.length - 1]?.url
                            return (
                                <div
                                    key={d.track.id}
                                    className="flex items-center gap-3 bg-zinc-800/50 rounded-xl p-3"
                                >
                                    {albumImg ? (
                                        <img src={albumImg} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-zinc-700 shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{d.track.name}</p>
                                        <p className="text-zinc-500 text-xs truncate">
                                            {d.track.artists.map((a) => a.name).join(", ")} &middot; #{d.oldRank} &rarr; #{d.newRank}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-lg font-bold" style={{ color }}>
                                            {icon}
                                        </span>
                                        <span className="text-sm font-semibold" style={{ color }}>
                                            {Math.abs(d.diff || 0)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* New tracks */}
            {newTracks.length > 0 && (
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="text-green-400">+</span> Nouveaux coups de coeur
                    </h3>
                    <div className="space-y-2">
                        {newTracks.slice(0, 15).map((d) => {
                            const albumImg = d.track.album.images?.[d.track.album.images.length - 1]?.url
                            return (
                                <div
                                    key={d.track.id}
                                    className="flex items-center gap-3 bg-green-500/5 border border-green-500/10 rounded-xl p-2.5"
                                >
                                    {albumImg ? (
                                        <img src={albumImg} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                                    ) : (
                                        <div className="w-8 h-8 rounded bg-zinc-700 shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-green-300 truncate">{d.track.name}</p>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {d.track.artists.map((a) => a.name).join(", ")}
                                        </p>
                                    </div>
                                    <span className="text-xs text-green-500 shrink-0">#{d.newRank}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Gone tracks */}
            {goneTracks.length > 0 && (
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="text-red-400">-</span> Plus dans ton top
                    </h3>
                    <div className="space-y-2">
                        {goneTracks.slice(0, 15).map((d) => {
                            const albumImg = d.track.album.images?.[d.track.album.images.length - 1]?.url
                            return (
                                <div
                                    key={d.track.id}
                                    className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-xl p-2.5 opacity-75"
                                >
                                    {albumImg ? (
                                        <img src={albumImg} alt="" className="w-8 h-8 rounded object-cover opacity-60 shrink-0" />
                                    ) : (
                                        <div className="w-8 h-8 rounded bg-zinc-700 shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-red-300 truncate line-through">{d.track.name}</p>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {d.track.artists.map((a) => a.name).join(", ")}
                                        </p>
                                    </div>
                                    <span className="text-xs text-red-500 shrink-0">ex-#{d.oldRank}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
