import { useEffect, useState } from "react"
import { RecentTrack } from "../App"

interface ListeningDay {
    date: string
    trackCount: number
}

interface StreakData {
    listeningDays: ListeningDay[]
    currentStreak: number
    longestStreak: number
    lastUpdated: string
}

interface ListeningStreaksProps {
    recentTracks: RecentTrack[]
}

const STORAGE_KEY = "spotify_listening_streak"

function getStoredStreakData(): StreakData {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (e) {
        console.error("Error reading streak data:", e)
    }
    return {
        listeningDays: [],
        currentStreak: 0,
        longestStreak: 0,
        lastUpdated: "",
    }
}

function saveStreakData(data: StreakData): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
        console.error("Error saving streak data:", e)
    }
}

function calculateStreaks(listeningDays: ListeningDay[]): { current: number; longest: number } {
    if (listeningDays.length === 0) return { current: 0, longest: 0 }

    const sortedDays = [...listeningDays].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    const listeningDates = new Set(sortedDays.map((d) => d.date))

    let current = 0
    if (!listeningDates.has(today) && !listeningDates.has(yesterday)) {
        current = 0
    } else {
        const checkDate = listeningDates.has(today) ? today : yesterday
        let currentDate = new Date(checkDate)
        while (listeningDates.has(currentDate.toISOString().split("T")[0])) {
            current++
            currentDate = new Date(currentDate.getTime() - 86400000)
        }
    }

    let longest = 0
    let tempStreak = 0
    let prevDate: Date | null = null

    for (const day of sortedDays) {
        const currentDateObj = new Date(day.date)
        if (prevDate === null) {
            tempStreak = 1
        } else {
            const diffDays = Math.round(
                (prevDate.getTime() - currentDateObj.getTime()) / 86400000
            )
            if (diffDays === 1) {
                tempStreak++
            } else {
                longest = Math.max(longest, tempStreak)
                tempStreak = 1
            }
        }
        prevDate = currentDateObj
    }
    longest = Math.max(longest, tempStreak, current)

    return { current, longest }
}

export function ListeningStreaks({ recentTracks }: ListeningStreaksProps) {
    const [streakData, setStreakData] = useState<StreakData>(getStoredStreakData)

    useEffect(() => {
        if (recentTracks.length === 0) return

        const newDates: Record<string, number> = {}
        recentTracks.forEach((track) => {
            const date = track.played_at.split("T")[0]
            newDates[date] = (newDates[date] || 0) + 1
        })

        const existingMap = new Map(
            streakData.listeningDays.map((d) => [d.date, d.trackCount])
        )

        Object.entries(newDates).forEach(([date, count]) => {
            const existing = existingMap.get(date) || 0
            existingMap.set(date, Math.max(existing, count))
        })

        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - 365)
        const cutoffStr = cutoffDate.toISOString().split("T")[0]

        const listeningDays = Array.from(existingMap.entries())
            .filter(([date]) => date >= cutoffStr)
            .map(([date, trackCount]) => ({ date, trackCount }))
            .sort((a, b) => b.date.localeCompare(a.date))

        const { current, longest } = calculateStreaks(listeningDays)

        const newData: StreakData = {
            listeningDays,
            currentStreak: current,
            longestStreak: Math.max(longest, streakData.longestStreak),
            lastUpdated: new Date().toISOString(),
        }

        setStreakData(newData)
        saveStreakData(newData)
    }, [recentTracks])

    const totalDays = streakData.listeningDays.length
    const isStreakActive = streakData.currentStreak > 0

    // Progress bar percentage (max 30 days for visual)
    const progressPercent = Math.min((streakData.currentStreak / 30) * 100, 100)

    return (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Serie d'ecoute</h2>
                {isStreakActive && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">
                        Active
                    </span>
                )}
            </div>

            {/* Main streak display */}
            <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">{streakData.currentStreak}</div>
                            <div className="text-xs text-zinc-400">jours</div>
                        </div>
                    </div>
                    {/* Circular progress */}
                    <svg className="absolute inset-0 w-24 h-24 -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="44"
                            fill="none"
                            stroke="#27272a"
                            strokeWidth="4"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="44"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${progressPercent * 2.76} 276`}
                            className="transition-all duration-500"
                        />
                    </svg>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Record personnel</span>
                        <span className="text-white font-semibold">{streakData.longestStreak} jours</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Jours d'ecoute total</span>
                        <span className="text-white font-semibold">{totalDays} jours</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Objectif 30 jours</span>
                        <span className="text-white font-semibold">{Math.round(progressPercent)}%</span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {isStreakActive && streakData.currentStreak >= 7 && (
                <p className="mt-4 text-center text-sm text-green-400">
                    {streakData.currentStreak} jours consecutifs ! Continue comme ca !
                </p>
            )}
        </div>
    )
}
