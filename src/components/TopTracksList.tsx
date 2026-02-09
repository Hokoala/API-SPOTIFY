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
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
            <h2 className="text-xl font-bold mb-6 text-center text-white">Top Titres</h2>

            <div className="space-y-2">
                {tracks.map((track, index) => (
                    <div
                        key={track.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition-all group"
                    >
                        <span className="w-8 text-center text-zinc-500 font-bold group-hover:text-green-400 transition-colors">{index + 1}</span>
                        {track.album.images?.[0]?.url ? (
                            <img
                                src={track.album.images[0].url}
                                alt={track.album.name}
                                className="w-12 h-12 rounded"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-zinc-700 rounded flex items-center justify-center">
                                <span className="text-lg font-bold text-white">{track.name[0]}</span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate text-white">{track.name}</h3>
                            <p className="text-zinc-400 text-sm truncate">
                                {track.artists.map((a) => a.name).join(", ")}
                            </p>
                        </div>
                        <span className="text-zinc-500 text-sm hidden sm:block truncate max-w-32">{track.album.name}</span>
                        <span className="text-zinc-500 text-sm">{formatDuration(track.duration_ms)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
