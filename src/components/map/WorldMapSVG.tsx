import { useState } from "react"
import { COUNTRY_POSITIONS, CONTINENT_PATHS } from "./worldMapPaths"
import { CountryTooltip } from "./CountryTooltip"

interface WorldMapSVGProps {
    countryArtists: Record<string, string[]>
}

export function WorldMapSVG({ countryArtists }: WorldMapSVGProps) {
    const [tooltip, setTooltip] = useState<{ code: string; x: number; y: number } | null>(null)

    const maxCount = Math.max(1, ...Object.values(countryArtists).map((a) => a.length))

    const getDotRadius = (code: string) => {
        const count = countryArtists[code]?.length || 0
        if (count === 0) return 0
        return 4 + (count / maxCount) * 10
    }

    return (
        <div className="relative">
            <svg
                viewBox="0 0 1000 500"
                className="w-full h-auto"
                style={{ maxHeight: "520px" }}
            >
                {/* Definitions */}
                <defs>
                    {/* Ocean gradient */}
                    <radialGradient id="ocean" cx="50%" cy="40%" r="70%">
                        <stop offset="0%" stopColor="#0c1929" />
                        <stop offset="100%" stopColor="#060d16" />
                    </radialGradient>
                    {/* Glow for active dots */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Pulse animation */}
                    <filter id="softGlow">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Ocean background */}
                <rect width="1000" height="500" fill="url(#ocean)" rx="8" />

                {/* Grid lines */}
                {[...Array(19)].map((_, i) => {
                    const x = (i * 1000) / 18
                    return (
                        <line key={`v${i}`} x1={x} y1={0} x2={x} y2={500} stroke="#1a2744" strokeWidth="0.5" />
                    )
                })}
                {[...Array(10)].map((_, i) => {
                    const y = (i * 500) / 9
                    return (
                        <line key={`h${i}`} x1={0} y1={y} x2={1000} y2={y} stroke="#1a2744" strokeWidth="0.5" />
                    )
                })}
                {/* Equator */}
                <line x1={0} y1={250} x2={1000} y2={250} stroke="#1e3a5f" strokeWidth="0.8" strokeDasharray="6 4" />

                {/* Continent outlines */}
                {CONTINENT_PATHS.map((d, i) => (
                    <path
                        key={i}
                        d={d}
                        fill="#162035"
                        stroke="#2a3f5f"
                        strokeWidth="1"
                        strokeLinejoin="round"
                    />
                ))}

                {/* Inactive country dots (no artists) */}
                {Object.entries(COUNTRY_POSITIONS).map(([code, { x, y }]) => {
                    if (countryArtists[code]?.length) return null
                    return (
                        <circle
                            key={code}
                            cx={x}
                            cy={y}
                            r={2}
                            fill="#2a3f5f"
                        />
                    )
                })}

                {/* Active country dots (with artists) - rings + glow */}
                {Object.entries(COUNTRY_POSITIONS).map(([code, { x, y }]) => {
                    const count = countryArtists[code]?.length || 0
                    if (count === 0) return null
                    const r = getDotRadius(code)
                    const intensity = Math.min(count / maxCount, 1)

                    return (
                        <g key={code}>
                            {/* Outer glow ring */}
                            <circle
                                cx={x}
                                cy={y}
                                r={r + 6}
                                fill="none"
                                stroke={`rgba(34, 197, 94, ${0.15 + intensity * 0.15})`}
                                strokeWidth="1"
                                filter="url(#softGlow)"
                            />
                            {/* Middle ring */}
                            <circle
                                cx={x}
                                cy={y}
                                r={r + 2}
                                fill={`rgba(34, 197, 94, ${0.08 + intensity * 0.1})`}
                                stroke={`rgba(34, 197, 94, ${0.3 + intensity * 0.3})`}
                                strokeWidth="1"
                            />
                            {/* Core dot */}
                            <circle
                                cx={x}
                                cy={y}
                                r={r}
                                fill={`rgba(34, 197, 94, ${0.6 + intensity * 0.4})`}
                                filter="url(#glow)"
                                className="cursor-pointer"
                                onMouseEnter={(e) =>
                                    setTooltip({ code, x: e.clientX, y: e.clientY })
                                }
                                onMouseMove={(e) =>
                                    tooltip?.code === code &&
                                    setTooltip({ code, x: e.clientX, y: e.clientY })
                                }
                                onMouseLeave={() => setTooltip(null)}
                            />
                            {/* Center highlight */}
                            <circle
                                cx={x - r * 0.2}
                                cy={y - r * 0.2}
                                r={r * 0.3}
                                fill="rgba(255,255,255,0.25)"
                                className="pointer-events-none"
                            />
                            {/* Count label for bigger dots */}
                            {count > 1 && r > 7 && (
                                <text
                                    x={x}
                                    y={y + 1.5}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize={Math.min(r, 10)}
                                    fontWeight="700"
                                    className="pointer-events-none"
                                >
                                    {count}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>

            {tooltip && countryArtists[tooltip.code] && (
                <CountryTooltip
                    code={tooltip.code}
                    name={COUNTRY_POSITIONS[tooltip.code]?.name || tooltip.code}
                    artists={countryArtists[tooltip.code]}
                    x={tooltip.x}
                    y={tooltip.y}
                />
            )}
        </div>
    )
}
