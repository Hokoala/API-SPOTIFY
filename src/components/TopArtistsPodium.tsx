interface TopArtist {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
    popularity: number;
}

interface TopArtistsPodiumProps {
    artists: TopArtist[];
}

export function TopArtistsPodium({ artists }: TopArtistsPodiumProps) {
    const top5 = artists.slice(0, 5);

    if (top5.length < 5) {
        return null;
    }

    const [first, second, third, fourth, fifth] = top5;

    const podiumColors = {
        1: "from-white to-gray-300",
        2: "from-white to-gray-300",
        3: "from-white to-gray-300",
        4: "from-white to-gray-300",
        5: "from-white to-gray-300",
    };

    const ArtistCard = ({
        artist,
        rank,
        size = "normal"
    }: {
        artist: TopArtist;
        rank: number;
        size?: "large" | "normal" | "small"
    }) => {
        const sizeClasses = {
            large: "w-32 h-32 md:w-40 md:h-40",
            normal: "w-24 h-24 md:w-28 md:h-28",
            small: "w-20 h-20 md:w-24 md:h-24",
        };

        const textSizeClasses = {
            large: "text-base md:text-lg",
            normal: "text-sm md:text-base",
            small: "text-xs md:text-sm",
        };

        return (
            <div className="flex flex-col items-center gap-2">
                <div className="relative">
                    <div className={`absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-gradient-to-br ${podiumColors[rank as keyof typeof podiumColors]} flex items-center justify-center shadow-lg`}>
                        <span className="text-black font-bold text-sm">{rank}</span>
                    </div>
                    {artist.images?.[0]?.url ? (
                        <img
                            src={artist.images[0].url}
                            alt={artist.name}
                            className={`${sizeClasses[size]} rounded-full object-cover border-4 border-gray-200 shadow-xl transition-transform hover:scale-105`}
                        />
                    ) : (
                        <div className={`${sizeClasses[size]} rounded-full bg-zinc-700 flex items-center justify-center border-4 border-zinc-800`}>
                            <span className="text-3xl font-bold">{artist.name[0]}</span>
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <h3 className={`font-bold ${textSizeClasses[size]} truncate max-w-[120px] text-black`}>
                        {artist.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mt-1">
                        <div className="w-16 md:w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-black to-gray-600 rounded-full transition-all duration-500"
                                style={{ width: `${artist.popularity}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-600">{artist.popularity}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center text-black">Top 5 Artistes</h2>

            {/* Podium Row: 2nd - 1st - 3rd */}
            <div className="flex items-end justify-center gap-4 md:gap-8 mb-6">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                    <ArtistCard artist={second} rank={2} size="normal" />
                    <div className="mt-3 w-20 md:w-24 h-16 bg-gradient-to-t from-zinc-800 to-zinc-600 rounded-t-lg flex items-center justify-center border border-white/20">
                        <span className="text-2xl font-bold text-white">2</span>
                    </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center -mt-4">
                    <ArtistCard artist={first} rank={1} size="large" />
                    <div className="mt-3 w-24 md:w-32 h-24 bg-gradient-to-t from-zinc-900 to-zinc-700 rounded-t-lg flex items-center justify-center border border-white/30">
                        <span className="text-3xl font-bold text-white">1</span>
                    </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                    <ArtistCard artist={third} rank={3} size="normal" />
                    <div className="mt-3 w-20 md:w-24 h-12 bg-gradient-to-t from-zinc-800 to-zinc-600 rounded-t-lg flex items-center justify-center border border-white/20">
                        <span className="text-2xl font-bold text-white">3</span>
                    </div>
                </div>
            </div>

            {/* 4th and 5th Row */}
            <div className="flex justify-center gap-8 md:gap-16 pt-4 border-t border-black/10">
                <ArtistCard artist={fourth} rank={4} size="small" />
                <ArtistCard artist={fifth} rank={5} size="small" />
            </div>
        </div>
    );
}
