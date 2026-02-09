interface Album {
    id: string;
    name: string;
    artist: string;
    image: string;
    playCount: number;
}

interface TopAlbumsProps {
    albums: Album[];
}

export function TopAlbums({ albums }: TopAlbumsProps) {
    const topAlbums = albums.slice(0, 6);

    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-xl font-bold mb-6 text-center text-white">
                Top Albums
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {topAlbums.map((album, index) => (
                    <div
                        key={album.id}
                        className="group relative"
                    >
                        {/* Album Cover */}
                        <div className="relative aspect-square rounded-lg overflow-hidden">
                            <img
                                src={album.image}
                                alt={album.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Rank Badge */}
                            <div className="absolute top-2 left-2 w-7 h-7 bg-green-500 text-black rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                {index + 1}
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="text-center text-white p-2">
                                    <p className="font-bold text-lg text-green-400">{album.playCount}</p>
                                    <p className="text-xs text-zinc-300">ecoutes</p>
                                </div>
                            </div>
                        </div>

                        {/* Album Info */}
                        <div className="mt-2 text-center">
                            <p className="font-medium text-white text-sm truncate">
                                {album.name}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                                {album.artist}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
