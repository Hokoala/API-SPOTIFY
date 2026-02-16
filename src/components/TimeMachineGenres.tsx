import type { Artist } from "@/App"

interface TimeMachineGenresProps {
    longTermArtists: Artist[]
    shortTermArtists: Artist[]
}

interface GenreShift {
    genre: string
    oldPct: number
    newPct: number
    diff: number
    status: "up" | "down" | "new" | "gone" | "stable"
}

function getGenreCounts(artists: Artist[]): Map<string, number> {
    const counts = new Map<string, number>()
    for (const a of artists) {
        for (const g of a.genres) {
            counts.set(g, (counts.get(g) || 0) + 1)
        }
    }
    return counts
}

function computeGenreShifts(longTerm: Artist[], shortTerm: Artist[]): GenreShift[] {
    const longCounts = getGenreCounts(longTerm)
    const shortCounts = getGenreCounts(shortTerm)
    const longTotal = [...longCounts.values()].reduce((a, b) => a + b, 0) || 1
    const shortTotal = [...shortCounts.values()].reduce((a, b) => a + b, 0) || 1

    const allGenres = new Set([...longCounts.keys(), ...shortCounts.keys()])
    const shifts: GenreShift[] = []

    for (const genre of allGenres) {
        const oldCount = longCounts.get(genre) || 0
        const newCount = shortCounts.get(genre) || 0
        const oldPct = (oldCount / longTotal) * 100
        const newPct = (newCount / shortTotal) * 100
        const diff = newPct - oldPct

        let status: GenreShift["status"]
        if (oldCount === 0) status = "new"
        else if (newCount === 0) status = "gone"
        else if (Math.abs(diff) < 0.5) status = "stable"
        else status = diff > 0 ? "up" : "down"

        shifts.push({ genre, oldPct, newPct, diff, status })
    }

    return shifts.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
}

const BAR_COLORS = {
    up: "#22c55e",
    down: "#f97316",
    new: "#3b82f6",
    gone: "#ef4444",
    stable: "#52525b",
}

export function TimeMachineGenres({ longTermArtists, shortTermArtists }: TimeMachineGenresProps) {
    const shifts = computeGenreShifts(longTermArtists, shortTermArtists)
    const topShifts = shifts.slice(0, 12)
    const newGenres = shifts.filter((s) => s.status === "new")
    const goneGenres = shifts.filter((s) => s.status === "gone")

    const maxPct = Math.max(...topShifts.map((s) => Math.max(s.oldPct, s.newPct)), 1)

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
                    <p className="text-3xl font-bold text-blue-400">{newGenres.length}</p>
                    <p className="text-zinc-400 text-sm mt-1">Nouveaux genres</p>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
                    <p className="text-3xl font-bold text-red-400">{goneGenres.length}</p>
                    <p className="text-zinc-400 text-sm mt-1">Genres abandonnes</p>
                </div>
            </div>

            {/* Before / After bars */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-lg font-bold mb-2">Evolution des genres</h3>
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-zinc-600" />
                        <span className="text-zinc-500 text-xs">Long terme</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span className="text-zinc-500 text-xs">Court terme</span>
                    </div>
                </div>
                <div className="space-y-4">
                    {topShifts.map((s) => {
                        const color = BAR_COLORS[s.status]
                        return (
                            <div key={s.genre}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-zinc-300 capitalize truncate max-w-[60%]">
                                        {s.genre}
                                    </span>
                                    <span
                                        className="text-xs font-semibold"
                                        style={{ color }}
                                    >
                                        {s.diff > 0 ? "+" : ""}
                                        {s.diff.toFixed(1)}%
                                    </span>
                                </div>
                                {/* Old bar */}
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-2 rounded-full bg-zinc-700 flex-1 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-zinc-500 transition-all"
                                            style={{ width: `${(s.oldPct / maxPct) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-600 w-10 text-right">
                                        {s.oldPct.toFixed(1)}%
                                    </span>
                                </div>
                                {/* New bar */}
                                <div className="flex items-center gap-2">
                                    <div className="h-2 rounded-full bg-zinc-700 flex-1 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${(s.newPct / maxPct) * 100}%`,
                                                backgroundColor: color,
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] w-10 text-right" style={{ color }}>
                                        {s.newPct.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* New genres pills */}
            {newGenres.length > 0 && (
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="text-blue-400">+</span> Genres decouverts recemment
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {newGenres.map((s) => (
                            <span
                                key={s.genre}
                                className="bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full px-3 py-1 text-sm capitalize"
                            >
                                {s.genre}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Gone genres pills */}
            {goneGenres.length > 0 && (
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="text-red-400">-</span> Genres delaisses
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {goneGenres.map((s) => (
                            <span
                                key={s.genre}
                                className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-full px-3 py-1 text-sm capitalize line-through opacity-75"
                            >
                                {s.genre}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
