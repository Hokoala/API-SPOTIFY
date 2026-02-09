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
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    const stats = [
        {
            icon: Clock,
            label: "Duree totale",
            value: hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`,
            subtext: "de vos top titres",
            color: "text-green-400",
        },
        {
            icon: Users,
            label: "Artistes",
            value: uniqueArtists.toString(),
            subtext: "ecoutes",
            color: "text-blue-400",
        },
        {
            icon: Music,
            label: "Titres",
            value: uniqueTracks.toString(),
            subtext: "differents",
            color: "text-purple-400",
        },
        {
            icon: Disc,
            label: "Genre favori",
            value: topGenre,
            subtext: "le plus ecoute",
            color: "text-orange-400",
        },
    ];

    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-xl font-bold mb-6 text-center text-white">Statistiques d'ecoute</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 hover:border-zinc-600 transition-all"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <span className="text-xs text-zinc-400 uppercase tracking-wide">
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-white truncate">
                            {stat.value}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">{stat.subtext}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
