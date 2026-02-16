import type { Artist } from "@/App"

interface ArtistDiff {
    artist: Artist
    status: "new" | "gone" | "up" | "down" | "stable"
    oldRank?: number
    newRank?: number
    diff?: number
}

interface TimeMachineArtistsProps {
    longTermArtists: Artist[]
    shortTermArtists: Artist[]
}

function computeDiffs(longTerm: Artist[], shortTerm: Artist[]): ArtistDiff[] {
    const longMap = new Map(longTerm.map((a, i) => [a.id, i]))
    const shortMap = new Map(shortTerm.map((a, i) => [a.id, i]))

    const diffs: ArtistDiff[] = []

    // Artists in short term
    for (let i = 0; i < shortTerm.length; i++) {
        const a = shortTerm[i]
        const oldIdx = longMap.get(a.id)
        if (oldIdx === undefined) {
            diffs.push({ artist: a, status: "new", newRank: i + 1 })
        } else {
            const diff = oldIdx - i // positive = moved up
            diffs.push({
                artist: a,
                status: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
                oldRank: oldIdx + 1,
                newRank: i + 1,
                diff,
            })
        }
    }

    // Artists gone from long term (not in short term)
    for (let i = 0; i < longTerm.length; i++) {
        const a = longTerm[i]
        if (!shortMap.has(a.id)) {
            diffs.push({ artist: a, status: "gone", oldRank: i + 1 })
        }
    }

    return diffs
}

const STATUS_CONFIG = {
    new: { label: "Nouveau", color: "#22c55e", icon: "+" },
    gone: { label: "Parti", color: "#ef4444", icon: "-" },
    up: { label: "Monte", color: "#22c55e", icon: "\u2191" },
    down: { label: "Descendu", color: "#f97316", icon: "\u2193" },
    stable: { label: "Stable", color: "#71717a", icon: "=" },
}

export function TimeMachineArtists({ longTermArtists, shortTermArtists }: TimeMachineArtistsProps) {
    const diffs = computeDiffs(longTermArtists, shortTermArtists)

    const newArtists = diffs.filter((d) => d.status === "new")
    const goneArtists = diffs.filter((d) => d.status === "gone")
    const movers = diffs
        .filter((d) => d.status === "up" || d.status === "down")
        .sort((a, b) => Math.abs(b.diff || 0) - Math.abs(a.diff || 0))
        .slice(0, 10)

    return (
        <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
                    <p className="text-3xl font-bold text-green-400">{newArtists.length}</p>
                    <p className="text-zinc-400 text-sm mt-1">Nouveaux artistes</p>
                    <p className="text-zinc-600 text-xs mt-1">Apparus recemment</p>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
                    <p className="text-3xl font-bold text-red-400">{goneArtists.length}</p>
                    <p className="text-zinc-400 text-sm mt-1">Artistes perdus</p>
                    <p className="text-zinc-600 text-xs mt-1">Plus dans ton top</p>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
                    <p className="text-3xl font-bold text-blue-400">
                        {diffs.filter((d) => d.status === "stable").length}
                    </p>
                    <p className="text-zinc-400 text-sm mt-1">Artistes stables</p>
                    <p className="text-zinc-600 text-xs mt-1">Toujours au meme rang</p>
                </div>
            </div>

            {/* Biggest movers */}
            {movers.length > 0 && (
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-lg font-bold mb-4">Plus gros mouvements</h3>
                    <div className="space-y-3">
                        {movers.map((d) => {
                            const cfg = STATUS_CONFIG[d.status]
                            const img = d.artist.images?.[d.artist.images.length - 1]?.url
                            return (
                                <div
                                    key={d.artist.id}
                                    className="flex items-center gap-3 bg-zinc-800/50 rounded-xl p-3"
                                >
                                    {img ? (
                                        <img src={img} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-zinc-700 shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{d.artist.name}</p>
                                        <p className="text-zinc-500 text-xs">
                                            #{d.oldRank} &rarr; #{d.newRank}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span
                                            className="text-lg font-bold"
                                            style={{ color: cfg.color }}
                                        >
                                            {cfg.icon}
                                        </span>
                                        <span
                                            className="text-sm font-semibold"
                                            style={{ color: cfg.color }}
                                        >
                                            {Math.abs(d.diff || 0)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* New arrivals */}
            {newArtists.length > 0 && (
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="text-green-400">+</span> Nouveaux dans ton top
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {newArtists.map((d) => {
                            const img = d.artist.images?.[d.artist.images.length - 1]?.url
                            return (
                                <div
                                    key={d.artist.id}
                                    className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5"
                                >
                                    {img ? (
                                        <img src={img} alt="" className="w-6 h-6 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-zinc-700" />
                                    )}
                                    <span className="text-sm text-green-300">{d.artist.name}</span>
                                    <span className="text-xs text-green-500">#{d.newRank}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Gone artists */}
            {goneArtists.length > 0 && (
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="text-red-400">-</span> Disparus de ton top
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {goneArtists.map((d) => {
                            const img = d.artist.images?.[d.artist.images.length - 1]?.url
                            return (
                                <div
                                    key={d.artist.id}
                                    className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1.5"
                                >
                                    {img ? (
                                        <img src={img} alt="" className="w-6 h-6 rounded-full object-cover opacity-60" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-zinc-700" />
                                    )}
                                    <span className="text-sm text-red-300 line-through opacity-75">{d.artist.name}</span>
                                    <span className="text-xs text-red-500">ex-#{d.oldRank}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
