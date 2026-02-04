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

    return (
        <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center text-black">Popularité des Artistes</h2>

            <div className="space-y-4">
                {topArtists.map((artist, index) => {
                    const barWidth = (artist.popularity / maxPopularity) * 100;
                    // Grayscale gradient based on position
                    const grayValue = 255 - index * 40;

                    return (
                        <div key={artist.id} className="group">
                            <div className="flex items-center gap-3 mb-2">
                                {/* Rank */}
                                <span className="w-6 text-center text-gray-500 font-mono text-sm">
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
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-sm font-bold text-black">{artist.name[0]}</span>
                                    </div>
                                )}

                                {/* Artist Name */}
                                <span className="flex-1 font-medium truncate text-black">{artist.name}</span>

                                {/* Popularity Score */}
                                <span className="text-sm font-mono text-black/80">
                                    {artist.popularity}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="ml-9 pl-3">
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${barWidth}%`,
                                            background: `linear-gradient(90deg, rgb(${50 + index * 30}, ${50 + index * 30}, ${50 + index * 30}) 0%, rgb(${100 + index * 30}, ${100 + index * 30}, ${100 + index * 30}) 100%)`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scale */}
            <div className="flex justify-between mt-4 ml-12 text-xs text-gray-400">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
            </div>
        </div>
    );
}
