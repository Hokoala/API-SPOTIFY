import { useEffect, useState } from "react"

interface AudioFeatures {
    tempo: number
    energy: number
    danceability: number
}

interface TempoAnalysisProps {
    trackIds: string[]
    token: string
}

const BPM_BUCKETS = [
    { label: "<80", min: 0, max: 80 },
    { label: "80-100", min: 80, max: 100 },
    { label: "100-120", min: 100, max: 120 },
    { label: "120-140", min: 120, max: 140 },
    { label: "140-160", min: 140, max: 160 },
    { label: "160-180", min: 160, max: 180 },
    { label: "180+", min: 180, max: Infinity },
]

export function TempoAnalysis({ trackIds, token }: TempoAnalysisProps) {
    const [features, setFeatures] = useState<AudioFeatures[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (trackIds.length === 0 || !token) {
            setLoading(false)
            return
        }

        const fetchAudioFeatures = async () => {
            setLoading(true)
            setError(false)
            try {
                const ids = trackIds.slice(0, 20).join(",")
                const res = await fetch(
                    `https://api.spotify.com/v1/audio-features?ids=${ids}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (!res.ok) {
                    setError(true)
                    return
                }
                const data = await res.json()
                const valid = (data.audio_features || []).filter(
                    (f: AudioFeatures | null) => f !== null
                )
                setFeatures(valid)
            } catch {
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchAudioFeatures()
    }, [trackIds, token])

    if (loading) {
        return (
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mt-8">
                <h2 className="text-xl font-bold text-white mb-4">Analyse de Tempo / BPM</h2>
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        )
    }

    if (error || features.length === 0) return null

    // Compute bucket counts
    const bucketCounts = BPM_BUCKETS.map((bucket) => ({
        ...bucket,
        count: features.filter((f) => f.tempo >= bucket.min && f.tempo < bucket.max).length,
    }))
    const maxCount = Math.max(...bucketCounts.map((b) => b.count), 1)

    // Find dominant bucket
    const dominant = bucketCounts.reduce((a, b) => (b.count > a.count ? b : a))

    // Averages
    const avgBpm = Math.round(features.reduce((s, f) => s + f.tempo, 0) / features.length)
    const avgEnergy = Math.round((features.reduce((s, f) => s + f.energy, 0) / features.length) * 100)
    const avgDance = Math.round((features.reduce((s, f) => s + f.danceability, 0) / features.length) * 100)

    const barWidth = 50
    const barGap = 16
    const chartWidth = BPM_BUCKETS.length * (barWidth + barGap) - barGap + 60
    const chartHeight = 200
    const barMaxHeight = 140

    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mt-8">
            <h2 className="text-xl font-bold text-white mb-2">Analyse de Tempo / BPM</h2>
            <p className="text-zinc-400 text-sm mb-6">
                Tu ecoutes majoritairement entre <span className="text-green-400 font-semibold">{dominant.label} BPM</span>
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">{avgBpm}</p>
                    <p className="text-xs text-zinc-400 mt-1">BPM moyen</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400">{avgEnergy}%</p>
                    <p className="text-xs text-zinc-400 mt-1">Energie moyenne</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">{avgDance}%</p>
                    <p className="text-xs text-zinc-400 mt-1">Dansabilite moyenne</p>
                </div>
            </div>

            {/* Histogram SVG */}
            <div className="overflow-x-auto">
                <svg
                    width={chartWidth}
                    height={chartHeight}
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="mx-auto"
                >
                    {bucketCounts.map((bucket, i) => {
                        const barHeight = bucket.count > 0 ? (bucket.count / maxCount) * barMaxHeight : 4
                        const x = 30 + i * (barWidth + barGap)
                        const y = chartHeight - 40 - barHeight

                        return (
                            <g key={bucket.label}>
                                {/* Bar */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    rx={6}
                                    fill={bucket.label === dominant.label ? "#22c55e" : "#3f3f46"}
                                    className="transition-all duration-300"
                                />
                                {/* Count on top */}
                                {bucket.count > 0 && (
                                    <text
                                        x={x + barWidth / 2}
                                        y={y - 8}
                                        textAnchor="middle"
                                        className="fill-white"
                                        style={{ fontSize: "13px", fontWeight: 600 }}
                                    >
                                        {bucket.count}
                                    </text>
                                )}
                                {/* Label below */}
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight - 12}
                                    textAnchor="middle"
                                    className="fill-zinc-400"
                                    style={{ fontSize: "11px" }}
                                >
                                    {bucket.label}
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>
        </div>
    )
}
