import { Clock, Music, Users, Disc } from "lucide-react";

interface ListeningStatsProps {
    totalMinutes: number;
    uniqueArtists: number;
    uniqueTracks: number;
    topGenre: string;
}

export function ListeningStats({
    totalMinutes,
    uniqueArtists,
    uniqueTracks,
    topGenre,
}: ListeningStatsProps) {
    const stats = [
        {
            icon: Clock,
            label: "Temps d'écoute",
            value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
            subtext: "ce mois-ci",
        },
        {
            icon: Users,
            label: "Artistes",
            value: uniqueArtists.toString(),
            subtext: "écoutés",
        },
        {
            icon: Music,
            label: "Titres",
            value: uniqueTracks.toString(),
            subtext: "différents",
        },
        {
            icon: Disc,
            label: "Genre favori",
            value: topGenre,
            subtext: "le plus écouté",
        },
    ];

    return (
        <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center text-black">Statistiques d'écoute</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 border border-black/5 hover:border-black/20 transition-all"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <stat.icon className="w-5 h-5 text-black/70" />
                            <span className="text-xs text-gray-600 uppercase tracking-wide">
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-black truncate">
                            {stat.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
