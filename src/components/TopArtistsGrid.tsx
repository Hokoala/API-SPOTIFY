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
    return (
        <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-6 text-center text-black">Top Artistes</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {artists.map((artist, index) => (
                    <div
                        key={artist.id}
                        className="bg-gray-50 rounded-lg p-4 border border-black/5 hover:bg-gray-100 transition-all group"
                    >
                        <div className="relative mb-4">
                            <span className="absolute -top-2 -left-2 w-8 h-8 bg-black text-white font-bold rounded-full flex items-center justify-center text-sm z-10">
                                {index + 1}
                            </span>
                            {artist.images?.[0]?.url ? (
                                <img
                                    src={artist.images[0].url}
                                    alt={artist.name}
                                    className="w-full aspect-square object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-full aspect-square bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-4xl font-bold text-black">{artist.name[0]}</span>
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-center truncate text-black">{artist.name}</h3>
                        <p className="text-gray-500 text-sm text-center truncate">
                            {artist.genres?.[0] || "Artiste"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
