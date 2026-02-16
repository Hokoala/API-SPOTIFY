interface PopularityDistributionProps {
    artistPopularities: number[]
    trackPopularities: number[]
}

const BUCKETS = [
    { label: "Underground", range: "0-19", color: "#8b5cf6" },
    { label: "Indie", range: "20-39", color: "#3b82f6" },
    { label: "Equilibre", range: "40-59", color: "#22c55e" },
    { label: "Populaire", range: "60-79", color: "#f97316" },
    { label: "Superstar", range: "80-100", color: "#ef4444" },
]

function bucketize(values: number[]): number[] {
    const counts = [0, 0, 0, 0, 0]
    for (const v of values) {
        const idx = Math.min(Math.floor(v / 20), 4)
        counts[idx]++
    }
    return counts
}

export function PopularityDistribution({
    artistPopularities,
    trackPopularities,
}: PopularityDistributionProps) {
    const allValues = [...artistPopularities, ...trackPopularities]
    const counts = bucketize(allValues)
    const maxCount = Math.max(...counts, 1)

    const barWidth = 50
    const gap = 16
    const chartWidth = BUCKETS.length * barWidth + (BUCKETS.length - 1) * gap
    const chartHeight = 160
    const svgWidth = chartWidth + 40
    const svgHeight = chartHeight + 60

    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
                Distribution de popularite
            </h3>
            <div className="flex justify-center overflow-x-auto">
                <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full max-w-lg"
                >
                    {BUCKETS.map((bucket, i) => {
                        const barHeight =
                            counts[i] > 0
                                ? (counts[i] / maxCount) * chartHeight
                                : 4
                        const x = 20 + i * (barWidth + gap)
                        const y = chartHeight - barHeight

                        return (
                            <g key={bucket.label}>
                                {/* Bar */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    rx={6}
                                    fill={bucket.color}
                                    opacity={0.85}
                                />
                                {/* Count */}
                                <text
                                    x={x + barWidth / 2}
                                    y={y - 8}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="13"
                                    fontWeight="bold"
                                >
                                    {counts[i]}
                                </text>
                                {/* Label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 18}
                                    textAnchor="middle"
                                    fill="#a1a1aa"
                                    fontSize="10"
                                >
                                    {bucket.label}
                                </text>
                                {/* Range */}
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 34}
                                    textAnchor="middle"
                                    fill="#52525b"
                                    fontSize="9"
                                >
                                    {bucket.range}
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>
        </div>
    )
}
