interface Artist {
    id: string;
    name: string;
    images: { url: string }[];
    popularity: number;
}

interface PopularityBarsProps {
    artists: Artist[];
}

export function PopularityBars({ artists }: PopularityBarsProps) {
    const topArtists = artists.slice(0, 5);
    const maxPopularity = Math.max(...topArtists.map((a) => a.popularity));

    const colors = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ec4899"];

    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-xl font-bold mb-6 text-center text-white">Popularite des Artistes</h2>

            <div className="space-y-4">
                {topArtists.map((artist, index) => {
                    const barWidth = (artist.popularity / maxPopularity) * 100;

                    return (
                        <div key={artist.id} className="group">
                            <div className="flex items-center gap-3 mb-2">
                                {/* Rank */}
                                <span className="w-6 text-center text-zinc-500 font-mono text-sm">
                                    #{index + 1}
                                </span>

                                {/* Artist Image */}
                                {artist.images?.[0]?.url ? (
                                    <img
                                        src={artist.images[0].url}
                                        alt={artist.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">{artist.name[0]}</span>
                                    </div>
                                )}

                                {/* Artist Name */}
                                <span className="flex-1 font-medium truncate text-white">{artist.name}</span>

                                {/* Popularity Score */}
                                <span className="text-sm font-mono text-zinc-400">
                                    {artist.popularity}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="ml-9 pl-3">
                                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${barWidth}%`,
                                            backgroundColor: colors[index] || "#6b7280",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scale */}
            <div className="flex justify-between mt-4 ml-12 text-xs text-zinc-500">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
            </div>
        </div>
    );
}
