import { useRef, useState, useEffect } from "react"
import { toPng } from "html-to-image"
import type { SpotifyData, TimeRange } from "@/App"

interface ExportStatsProps {
    spotifyData: SpotifyData
    timeRange: TimeRange
    topGenre: string
    totalMinutes: number
}

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
    short_term: "4 dernières semaines",
    medium_term: "6 derniers mois",
    long_term: "Depuis toujours",
}

const imageToBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url)
        const blob = await response.blob()
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        console.error("Error converting image:", error)
        return ""
    }
}

export function ExportStats({ spotifyData, timeRange, topGenre, totalMinutes }: ExportStatsProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [exporting, setExporting] = useState(false)
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [base64Images, setBase64Images] = useState<Record<string, string>>({})

    const { user, topArtists, topTracks } = spotifyData
    const top5Artists = topArtists.slice(0, 5)
    const top5Tracks = topTracks.slice(0, 5)

    useEffect(() => {
        const loadImages = async () => {
            const imageMap: Record<string, string> = {}

            if (user?.images?.[0]?.url) {
                imageMap["user"] = await imageToBase64(user.images[0].url)
            }

            for (const artist of top5Artists) {
                if (artist.images?.[0]?.url) {
                    imageMap[`artist-${artist.id}`] = await imageToBase64(artist.images[0].url)
                }
            }

            for (const track of top5Tracks) {
                if (track.album.images?.[0]?.url) {
                    imageMap[`track-${track.id}`] = await imageToBase64(track.album.images[0].url)
                }
            }

            setBase64Images(imageMap)
            setImagesLoaded(true)
        }

        loadImages()
    }, [user, top5Artists, top5Tracks])

    const handleExport = async () => {
        if (!cardRef.current || !imagesLoaded) return
        setExporting(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 100))

            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: "#0a0a0a",
            })

            const link = document.createElement("a")
            link.download = `spotify-stats-${user?.display_name || "user"}-${timeRange}.png`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error("Export error:", err)
            alert("Erreur lors de l'export. Réessayez.")
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="mt-8">
            {/* Export Button */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Exporter mes stats</h2>
                    <p className="text-zinc-400 text-sm mt-1">
                        Télécharge une image de tes statistiques à partager
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={exporting || !imagesLoaded}
                    className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {exporting ? (
                        <>
                            <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                            Export en cours...
                        </>
                    ) : !imagesLoaded ? (
                        <>
                            <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                            Chargement...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Télécharger mes stats
                        </>
                    )}
                </button>
            </div>

            {/* Card FORMAT TÉLÉPHONE COMPLET */}
            <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <div
                    ref={cardRef}
                    style={{
                        width: "420px",
                        height: "920px",
                        background: "linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
                        padding: "24px 20px",
                        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "20px",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    {/* Background glow */}
                    <div style={{
                        position: "absolute",
                        top: "30%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "250px",
                        height: "250px",
                        background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
                        borderRadius: "50%",
                        pointerEvents: "none"
                    }} />

                    {/* ===== HEADER ===== */}
                    <div style={{ textAlign: "center", marginBottom: "16px", position: "relative", zIndex: 1 }}>
                        {base64Images["user"] ? (
                            <img
                                src={base64Images["user"]}
                                alt=""
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "3px solid #22c55e",
                                    margin: "0 auto 10px"
                                }}
                            />
                        ) : (
                            <div style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                                backgroundColor: "#27272a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "3px solid #22c55e",
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#22c55e",
                                margin: "0 auto 10px"
                            }}>
                                {user?.display_name?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "2px" }}>
                            {user?.display_name || "Utilisateur"}
                        </div>
                        <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: "500" }}>
                            {TIME_RANGE_LABELS[timeRange]}
                        </div>
                    </div>

                    {/* ===== STATS ROW ===== */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "18px", position: "relative", zIndex: 1 }}>
                        {[
                            { value: totalMinutes, label: "MIN" },
                            { value: topArtists.length, label: "ARTISTES" },
                            { value: topTracks.length, label: "TITRES" },
                        ].map((stat, i) => (
                            <div key={i} style={{
                                textAlign: "center",
                                background: "rgba(39,39,42,0.6)",
                                borderRadius: "10px",
                                padding: "8px 14px",
                                border: "1px solid #3f3f46",
                                minWidth: "65px"
                            }}>
                                <div style={{ fontSize: "18px", fontWeight: "bold", color: "#22c55e" }}>{stat.value}</div>
                                <div style={{ fontSize: "8px", color: "#71717a", letterSpacing: "0.5px" }}>{stat.label}</div>
                            </div>
                        ))}
                        <div style={{
                            textAlign: "center",
                            background: "rgba(34,197,94,0.12)",
                            borderRadius: "10px",
                            padding: "8px 14px",
                            border: "1px solid rgba(34,197,94,0.3)",
                            minWidth: "65px"
                        }}>
                            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#22c55e", textTransform: "capitalize" }}>{topGenre}</div>
                            <div style={{ fontSize: "8px", color: "#71717a" }}>GENRE</div>
                        </div>
                    </div>

                    {/* ===== TOP ARTISTES ===== */}
                    <div style={{ marginBottom: "14px", position: "relative", zIndex: 1 }}>
                        <div style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: "#22c55e",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            textAlign: "center"
                        }}>
                            🎤 Top 5 Artistes
                        </div>
                        {top5Artists.map((artist, i) => (
                            <div
                                key={artist.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "5px",
                                    background: i === 0 ? "rgba(34,197,94,0.1)" : "rgba(39,39,42,0.35)",
                                    borderRadius: "10px",
                                    padding: "6px 10px",
                                    border: i === 0 ? "1px solid rgba(34,197,94,0.3)" : "none",
                                }}
                            >
                                <span style={{
                                    fontSize: "12px",
                                    color: i === 0 ? "#22c55e" : "#52525b",
                                    width: "16px",
                                    fontWeight: "bold"
                                }}>
                                    {i + 1}
                                </span>
                                {base64Images[`artist-${artist.id}`] ? (
                                    <img
                                        src={base64Images[`artist-${artist.id}`]}
                                        alt=""
                                        style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#3f3f46", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🎤</div>
                                )}
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontSize: "12px", fontWeight: i === 0 ? "600" : "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {artist.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ===== TOP TITRES ===== */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: "#22c55e",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            textAlign: "center"
                        }}>
                            🎵 Top 5 Titres
                        </div>
                        {top5Tracks.map((track, i) => (
                            <div
                                key={track.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "5px",
                                    background: i === 0 ? "rgba(34,197,94,0.1)" : "rgba(39,39,42,0.35)",
                                    borderRadius: "10px",
                                    padding: "6px 10px",
                                    border: i === 0 ? "1px solid rgba(34,197,94,0.3)" : "none",
                                }}
                            >
                                <span style={{
                                    fontSize: "12px",
                                    color: i === 0 ? "#22c55e" : "#52525b",
                                    width: "16px",
                                    fontWeight: "bold"
                                }}>
                                    {i + 1}
                                </span>
                                {base64Images[`track-${track.id}`] ? (
                                    <img
                                        src={base64Images[`track-${track.id}`]}
                                        alt=""
                                        style={{ width: "30px", height: "30px", borderRadius: "6px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div style={{ width: "30px", height: "30px", borderRadius: "6px", backgroundColor: "#3f3f46", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🎵</div>
                                )}
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontSize: "12px", fontWeight: i === 0 ? "600" : "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {track.name}
                                    </div>
                                    <div style={{ fontSize: "9px", color: "#71717a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {track.artists.map(a => a.name).join(", ")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ===== FOOTER ===== */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        paddingTop: "14px",
                        borderTop: "1px solid #222",
                        position: "relative",
                        zIndex: 1
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                            <span style={{ fontSize: "10px", color: "#71717a", fontWeight: "500" }}>Spotify Stats</span>
                        </div>
                        <span style={{ fontSize: "9px", color: "#52525b" }}>
                            {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}