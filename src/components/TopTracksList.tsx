interface TopTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    duration_ms: number;
}

interface TopTracksListProps {
    tracks: TopTrack[];
}

export function TopTracksList({ tracks }: TopTracksListProps) {
    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-6 text-center text-black">Top Titres</h2>

            <div className="space-y-2">
                {tracks.map((track, index) => (
                    <div
                        key={track.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <span className="w-8 text-center text-gray-400 font-bold">{index + 1}</span>
                        {track.album.images?.[0]?.url ? (
                            <img
                                src={track.album.images[0].url}
                                alt={track.album.name}
                                className="w-12 h-12 rounded"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-lg font-bold text-black">{track.name[0]}</span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate text-black">{track.name}</h3>
                            <p className="text-gray-500 text-sm truncate">
                                {track.artists.map((a) => a.name).join(", ")}
                            </p>
                        </div>
                        <span className="text-gray-400 text-sm hidden sm:block">{track.album.name}</span>
                        <span className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
