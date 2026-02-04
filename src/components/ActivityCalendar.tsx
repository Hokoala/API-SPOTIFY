interface ActivityDay {
    date: string;
    count: number;
}

interface ActivityCalendarProps {
    data: ActivityDay[];
}

export function ActivityCalendar({ data }: ActivityCalendarProps) {
    // Generate last 16 weeks of data (112 days)
    const weeks = 16;
    const days = weeks * 7;

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days + 1);

    // Create a map for quick lookup
    const activityMap = new Map(data.map((d) => [d.date, d.count]));

    // Generate all days
    const allDays: { date: Date; count: number }[] = [];
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        allDays.push({
            date,
            count: activityMap.get(dateStr) || 0,
        });
    }

    // Group by weeks
    const weeksArray: { date: Date; count: number }[][] = [];
    for (let i = 0; i < weeks; i++) {
        weeksArray.push(allDays.slice(i * 7, (i + 1) * 7));
    }

    // Get intensity level (0-4)
    const maxCount = Math.max(...data.map((d) => d.count), 1);
    const getLevel = (count: number): number => {
        if (count === 0) return 0;
        const ratio = count / maxCount;
        if (ratio <= 0.25) return 1;
        if (ratio <= 0.5) return 2;
        if (ratio <= 0.75) return 3;
        return 4;
    };

    const levelColors = [
        "bg-gray-100",
        "bg-gray-300",
        "bg-gray-400",
        "bg-gray-600",
        "bg-gray-800",
    ];

    const dayNames = ["Lun", "", "Mer", "", "Ven", "", ""];
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

    // Get month labels
    const monthLabels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeksArray.forEach((week, weekIndex) => {
        const firstDay = week[0];
        if (firstDay && firstDay.date.getMonth() !== lastMonth) {
            lastMonth = firstDay.date.getMonth();
            monthLabels.push({ month: monthNames[lastMonth], weekIndex });
        }
    });

    return (
        <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center text-black">
                Activité d'écoute
            </h2>

            <div className="overflow-x-auto">
                {/* Month labels */}
                <div className="flex mb-2 ml-8">
                    {monthLabels.map((label, index) => (
                        <div
                            key={index}
                            className="text-xs text-gray-500"
                            style={{
                                marginLeft: index === 0 ? `${label.weekIndex * 14}px` : `${(label.weekIndex - (monthLabels[index - 1]?.weekIndex || 0)) * 14 - 20}px`,
                            }}
                        >
                            {label.month}
                        </div>
                    ))}
                </div>

                <div className="flex gap-1">
                    {/* Day labels */}
                    <div className="flex flex-col gap-1 mr-2">
                        {dayNames.map((day, index) => (
                            <div key={index} className="h-3 text-xs text-gray-400 leading-3">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="flex gap-1">
                        {weeksArray.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-1">
                                {week.map((day, dayIndex) => {
                                    const level = getLevel(day.count);
                                    return (
                                        <div
                                            key={dayIndex}
                                            className={`w-3 h-3 rounded-sm ${levelColors[level]} transition-all hover:ring-1 hover:ring-black/30`}
                                            title={`${day.date.toLocaleDateString("fr-FR")}: ${day.count} titres`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-4">
                    <span className="text-xs text-gray-500">Moins</span>
                    {levelColors.map((color, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-sm ${color}`}
                        />
                    ))}
                    <span className="text-xs text-gray-500">Plus</span>
                </div>
            </div>
        </div>
    );
}
