interface GenreData {
    name: string;
    count: number;
}

interface GenreDonutChartProps {
    genres: GenreData[];
}

export function GenreDonutChart({ genres }: GenreDonutChartProps) {
    const total = genres.reduce((sum, g) => sum + g.count, 0);
    const topGenres = genres.slice(0, 6);

    let currentAngle = 0;
    const colors = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ec4899", "#14b8a6"];

    const segments = topGenres.map((genre, index) => {
        const percentage = (genre.count / total) * 100;
        const angle = (percentage / 100) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;

        return {
            ...genre,
            percentage,
            startAngle,
            endAngle: currentAngle,
            color: colors[index] || "#6b7280",
        };
    });

    const createArc = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        const x1 = 100 + radius * Math.cos(startRad);
        const y1 = 100 + radius * Math.sin(startRad);
        const x2 = 100 + radius * Math.cos(endRad);
        const y2 = 100 + radius * Math.sin(endRad);

        const x3 = 100 + innerRadius * Math.cos(endRad);
        const y3 = 100 + innerRadius * Math.sin(endRad);
        const x4 = 100 + innerRadius * Math.cos(startRad);
        const y4 = 100 + innerRadius * Math.sin(startRad);

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    };

    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-xl font-bold mb-6 text-center text-white">Distribution des Genres</h2>

            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        {segments.map((segment, index) => (
                            <path
                                key={index}
                                d={createArc(segment.startAngle, segment.endAngle, 90, 50)}
                                fill={segment.color}
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        ))}
                        <circle cx="100" cy="100" r="45" fill="#18181b" />
                        <text
                            x="100"
                            y="95"
                            textAnchor="middle"
                            className="fill-white text-2xl font-bold"
                            style={{ fontSize: "24px" }}
                        >
                            {topGenres.length}
                        </text>
                        <text
                            x="100"
                            y="115"
                            textAnchor="middle"
                            className="fill-zinc-400"
                            style={{ fontSize: "12px" }}
                        >
                            genres
                        </text>
                    </svg>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                    {segments.map((segment, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: segment.color }}
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate capitalize text-white">{segment.name}</p>
                                <p className="text-xs text-zinc-500">{segment.percentage.toFixed(1)}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
