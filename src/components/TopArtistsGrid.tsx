import { useState } from "react";

interface TopArtist {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
    popularity: number;
}

interface TopArtistsGridProps {
    artists: TopArtist[];
}

export function TopArtistsGrid({ artists }: TopArtistsGridProps) {
    const [showAll, setShowAll] = useState(false);
    const displayedArtists = showAll ? artists : artists.slice(0, 5);

    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
            <h2 className="text-xl font-bold mb-6 text-center text-white">Top Artistes</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayedArtists.map((artist, index) => (
                    <div
                        key={artist.id}
                        className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800 transition-all group"
                    >
                        <div className="relative mb-4">
                            <span className="absolute -top-2 -left-2 w-8 h-8 bg-green-500 text-black font-bold rounded-full flex items-center justify-center text-sm z-10">
                                {index + 1}
                            </span>
                            {artist.images?.[0]?.url ? (
                                <img
                                    src={artist.images[0].url}
                                    alt={artist.name}
                                    className="w-full aspect-square object-cover rounded-full ring-2 ring-zinc-700 group-hover:ring-green-500/50 transition-all"
                                />
                            ) : (
                                <div className="w-full aspect-square bg-zinc-700 rounded-full flex items-center justify-center ring-2 ring-zinc-600">
                                    <span className="text-4xl font-bold text-white">{artist.name[0]}</span>
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-center truncate text-white">{artist.name}</h3>
                        <p className="text-zinc-400 text-sm text-center truncate">
                            {artist.genres?.[0] || "Artiste"}
                        </p>
                    </div>
                ))}
            </div>

            {artists.length > 5 && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-6 py-2 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 transition-colors"
                    >
                        {showAll ? "Voir moins" : "Voir plus"}
                    </button>
                </div>
            )}
        </div>
    );
}
