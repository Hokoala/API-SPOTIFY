interface MainstreamGaugeProps {
    score: number
    label: string
}

export function MainstreamGauge({ score, label }: MainstreamGaugeProps) {
    const radius = 120
    const strokeWidth = 20
    const cx = 150
    const cy = 150
    const startAngle = Math.PI
    const endAngle = 0
    const scoreAngle = startAngle - (score / 100) * Math.PI

    const arcPath = (start: number, end: number) => {
        const x1 = cx + radius * Math.cos(start)
        const y1 = cy - radius * Math.sin(start)
        const x2 = cx + radius * Math.cos(end)
        const y2 = cy - radius * Math.sin(end)
        const largeArc = Math.abs(start - end) > Math.PI ? 1 : 0
        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
    }

    const needleX = cx + (radius - 10) * Math.cos(scoreAngle)
    const needleY = cy - (radius - 10) * Math.sin(scoreAngle)

    const getColor = (s: number) => {
        if (s < 20) return "#8b5cf6"
        if (s < 40) return "#3b82f6"
        if (s < 60) return "#22c55e"
        if (s < 80) return "#f97316"
        return "#ef4444"
    }

    const color = getColor(score)

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 300 180" className="w-full max-w-xs">
                {/* Background arc */}
                <path
                    d={arcPath(startAngle, endAngle)}
                    fill="none"
                    stroke="#27272a"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Score arc */}
                <path
                    d={arcPath(startAngle, scoreAngle)}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    style={{
                        filter: `drop-shadow(0 0 8px ${color}40)`,
                    }}
                />
                {/* Needle dot */}
                <circle cx={needleX} cy={needleY} r={6} fill={color} />
                {/* Score text */}
                <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill="white"
                    fontSize="48"
                    fontWeight="bold"
                >
                    {Math.round(score)}
                </text>
                <text
                    x={cx}
                    y={cy + 20}
                    textAnchor="middle"
                    fill="#a1a1aa"
                    fontSize="14"
                >
                    / 100
                </text>
                {/* Labels */}
                <text x={30} y={170} fill="#71717a" fontSize="10" textAnchor="middle">
                    Underground
                </text>
                <text x={270} y={170} fill="#71717a" fontSize="10" textAnchor="middle">
                    Mainstream
                </text>
            </svg>
            <p className="text-xl font-bold mt-2" style={{ color }}>
                {label}
            </p>
        </div>
    )
}
