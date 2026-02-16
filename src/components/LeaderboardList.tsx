export interface ComparisonEntry {
    friendName: string
    friendImage: string
    score: number
    commonArtists: string[]
    commonTracks: string[]
    commonGenres: string[]
    comparedAt: string
}

interface LeaderboardListProps {
    entries: ComparisonEntry[]
    onDelete: (friendName: string) => void
}

const MEDALS = ["text-yellow-400", "text-zinc-300", "text-amber-600"]

export function LeaderboardList({ entries, onDelete }: LeaderboardListProps) {
    if (entries.length === 0) {
        return (
            <div className="bg-zinc-900 rounded-2xl p-12 border border-zinc-800 text-center">
                <p className="text-4xl mb-4">🏆</p>
                <p className="text-xl font-bold text-white mb-2">Aucune comparaison</p>
                <p className="text-zinc-400">
                    Compare ta musique avec tes amis depuis la page{" "}
                    <span className="text-green-400">Comparer</span> pour les voir apparaitre ici !
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {entries.map((entry, index) => {
                const scoreColor =
                    entry.score >= 70 ? "text-green-400" : entry.score >= 40 ? "text-yellow-400" : "text-red-400"

                return (
                    <div
                        key={entry.friendName}
                        className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center gap-4 hover:bg-zinc-800/50 transition-colors"
                    >
                        {/* Rank */}
                        <div className="w-10 text-center flex-shrink-0">
                            {index < 3 ? (
                                <span className={`text-2xl font-bold ${MEDALS[index]}`}>
                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                                </span>
                            ) : (
                                <span className="text-lg font-bold text-zinc-500">#{index + 1}</span>
                            )}
                        </div>

                        {/* Avatar */}
                        {entry.friendImage ? (
                            <img
                                src={entry.friendImage}
                                alt={entry.friendName}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-700"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center ring-2 ring-zinc-700">
                                <span className="text-lg font-bold text-white">{entry.friendName[0]}</span>
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">{entry.friendName}</p>
                            <p className="text-zinc-400 text-sm">
                                {entry.commonArtists.length} artistes, {entry.commonTracks.length} titres, {entry.commonGenres.length} genres en commun
                            </p>
                        </div>

                        {/* Score */}
                        <div className="text-right flex-shrink-0">
                            <p className={`text-2xl font-bold ${scoreColor}`}>{entry.score}%</p>
                            <p className="text-zinc-500 text-xs">
                                {new Date(entry.comparedAt).toLocaleDateString("fr-FR")}
                            </p>
                        </div>

                        {/* Delete */}
                        <button
                            onClick={() => onDelete(entry.friendName)}
                            className="flex-shrink-0 p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Supprimer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
