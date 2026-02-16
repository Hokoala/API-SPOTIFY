import { useEffect, useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import DashboardPage from "./pages/DashboardPage"
import SearchPage from "./pages/SearchPage"
import ComparePage from "./pages/ComparePage"
import LeaderboardPage from "./pages/LeaderboardPage"
import WrappedPage from "./pages/WrappedPage"
import WorldMapPage from "./pages/WorldMapPage"
import MainstreamPage from "./pages/MainstreamPage"
import TierListPage from "./pages/TierListPage"
import TimeMachinePage from "./pages/TimeMachinePage"
import ReviewsPage from "./pages/ReviewsPage"

export interface SpotifyUser {
    id: string
    display_name: string
    email: string
    images: { url: string }[]
    followers: { total: number }
    country: string
    product: string
}

export interface Artist {
    id: string
    name: string
    images: { url: string }[]
    genres: string[]
    popularity: number
}

export interface Track {
    id: string
    name: string
    artists: { name: string }[]
    album: {
        name: string
        images: { url: string }[]
    }
    duration_ms: number
    preview_url?: string | null
    popularity?: number
}

export interface RecentTrack {
    track: {
        id: string
        name: string
        artists: { name: string }[]
        album: {
            name: string
            images: { url: string }[]
        }
    }
    played_at: string
}

export interface SpotifyData {
    user: SpotifyUser | null
    topArtists: Artist[]
    topTracks: Track[]
    recentTracks: RecentTrack[]
}

export type TimeRange = "short_term" | "medium_term" | "long_term"

function App() {
    const [token, setToken] = useState<string | null>(null)
    const [spotifyData, setSpotifyData] = useState<SpotifyData>({
        user: null,
        topArtists: [],
        topTracks: [],
        recentTracks: [],
    })
    const [loading, setLoading] = useState(true)
    const [dataLoading, setDataLoading] = useState(false)
    const [timeRange, setTimeRange] = useState<TimeRange>("medium_term")

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search)
            const code = params.get("code")

            if (code) {
                try {
                    const clientId = import.meta.env.VITE_CLIENT_ID
                    const redirectUri = import.meta.env.VITE_REDIRECT_URI
                    const codeVerifier = localStorage.getItem("code_verifier")

                    if (!codeVerifier) {
                        console.error("Code verifier not found")
                        setLoading(false)
                        return
                    }

                    const response = await fetch("https://accounts.spotify.com/api/token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({
                            grant_type: "authorization_code",
                            code: code,
                            redirect_uri: redirectUri,
                            client_id: clientId,
                            code_verifier: codeVerifier,
                        }),
                    })

                    localStorage.removeItem("code_verifier")

                    const data = await response.json()

                    if (data.access_token) {
                        setToken(data.access_token)
                        localStorage.setItem("spotify_token", data.access_token)
                        const redirectPath = localStorage.getItem("redirect_after_login")
                        if (redirectPath) {
                            localStorage.removeItem("redirect_after_login")
                            window.history.replaceState({}, document.title, redirectPath)
                        } else {
                            window.history.replaceState({}, document.title, "/")
                        }
                    }
                } catch (error) {
                    console.error("Erreur d'authentification:", error)
                }
            } else {
                const savedToken = localStorage.getItem("spotify_token")
                if (savedToken) {
                    setToken(savedToken)
                }
            }
            setLoading(false)
        }

        handleCallback()
    }, [])

    useEffect(() => {
        const fetchSpotifyData = async () => {
            if (!token) return

            setDataLoading(true)
            try {
                const headers = { Authorization: `Bearer ${token}` }

                const [userRes, artistsRes, tracksRes, recentRes] = await Promise.all([
                    fetch("https://api.spotify.com/v1/me", { headers }),
                    fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`, { headers }),
                    fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`, { headers }),
                    fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", { headers }),
                ])

                if (!userRes.ok) {
                    localStorage.removeItem("spotify_token")
                    setToken(null)
                    return
                }

                const [user, artistsData, tracksData, recentData] = await Promise.all([
                    userRes.json(),
                    artistsRes.ok ? artistsRes.json() : { items: [] },
                    tracksRes.ok ? tracksRes.json() : { items: [] },
                    recentRes.ok ? recentRes.json() : { items: [] },
                ])

                setSpotifyData({
                    user,
                    topArtists: artistsData.items || [],
                    topTracks: tracksData.items || [],
                    recentTracks: recentData.items || [],
                })
            } catch (error) {
                console.error("Erreur:", error)
            } finally {
                setDataLoading(false)
            }
        }

        fetchSpotifyData()
    }, [token, timeRange])

    const handleLogout = () => {
        localStorage.removeItem("spotify_token")
        setToken(null)
        setSpotifyData({
            user: null,
            topArtists: [],
            topTracks: [],
            recentTracks: [],
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    if (!token) {
        // Store compare URL for redirect after login
        const currentPath = window.location.pathname + window.location.search
        if (currentPath.startsWith("/compare?data=")) {
            localStorage.setItem("redirect_after_login", currentPath)
        }
        return <Login />
    }

    if (dataLoading && !spotifyData.user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
                <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
                <p className="text-white text-lg">Chargement de vos donnees Spotify...</p>
            </div>
        )
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
                path="/dashboard"
                element={
                    <DashboardPage
                        onLogout={handleLogout}
                        spotifyData={spotifyData}
                        timeRange={timeRange}
                        onTimeRangeChange={setTimeRange}
                        isLoading={dataLoading}
                        token={token || ""}
                    />
                }
            />
            <Route
                path="/search"
                element={
                    <SearchPage
                        onLogout={handleLogout}
                        user={{
                            name: spotifyData.user?.display_name || "",
                            email: spotifyData.user?.email || "",
                            image: spotifyData.user?.images?.[0]?.url,
                        }}
                    />
                }
            />
            <Route
                path="/compare"
                element={
                    <ComparePage
                        onLogout={handleLogout}
                        spotifyData={spotifyData}
                        token={token || ""}
                    />
                }
            />
            <Route
                path="/leaderboard"
                element={
                    <LeaderboardPage
                        onLogout={handleLogout}
                        spotifyData={spotifyData}
                    />
                }
            />
<Route
                path="/wrapped"
                element={
                    <WrappedPage
                        spotifyData={spotifyData}
                        token={token || ""}
                    />
                }
            />
            <Route
                path="/map"
                element={
                    <WorldMapPage
                        onLogout={handleLogout}
                        spotifyData={spotifyData}
                    />
                }
            />
            <Route
                path="/mainstream"
                element={
                    <MainstreamPage
                        onLogout={handleLogout}
                        spotifyData={spotifyData}
                    />
                }
            />
            <Route
                path="/tierlist"
                element={
                    <TierListPage
                        onLogout={handleLogout}
                        spotifyData={spotifyData}
                    />
                }
            />
            <Route
                path="/time-machine"
                element={
                    <TimeMachinePage
                        onLogout={handleLogout}
                        spotifyData={spotifyData}
                        token={token || ""}
                    />
                }
            />
            <Route
                path="/reviews"
                element={
                    <ReviewsPage
                        onLogout={handleLogout}
                        spotifyData={spotifyData}
                        token={token || ""}
                    />
                }
            />
            <Route path="/callback" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default App
