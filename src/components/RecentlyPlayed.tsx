import { Play } from "lucide-react";

interface RecentTrack {
    id: string;
    name: string;
    artist: string;
    album: string;
    albumImage: string;
    playedAt: string;
}

interface RecentlyPlayedProps {
    tracks: RecentTrack[];
}

export function RecentlyPlayed({ tracks }: RecentlyPlayedProps) {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 1) return "À l'instant";
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center text-black">
                Écoutés récemment
            </h2>

            <div className="space-y-3">
                {tracks.slice(0, 8).map((track, index) => (
                    <div
                        key={`${track.id}-${index}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all group"
                    >
                        {/* Album Cover */}
                        <div className="relative flex-shrink-0">
                            <img
                                src={track.albumImage}
                                alt={track.album}
                                className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                        </div>

                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-black truncate">{track.name}</p>
                            <p className="text-sm text-gray-500 truncate">{track.artist}</p>
                        </div>

                        {/* Time */}
                        <div className="flex-shrink-0 text-right">
                            <p className="text-xs text-gray-400">{formatTime(track.playedAt)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
