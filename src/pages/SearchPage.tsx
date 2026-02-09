import { useState, useEffect } from "react"
import { Header } from "@/layout/header"
import Background from "@/components/ColorBends"

const clientId = import.meta.env.VITE_CLIENT_ID
const clientSecret = import.meta.env.VITE_CLIENT_SECRET

interface Album {
    id: string
    name: string
    release_date: string
    images: { url: string }[]
    external_urls: { spotify: string }
}

interface SearchPageProps {
    onLogout: () => void
    user?: {
        name: string
        email: string
        image?: string
    }
}

export default function SearchPage({ onLogout, user }: SearchPageProps) {
    const [searchInput, setSearchInput] = useState("")
    const [accessToken, setAccessToken] = useState("")
    const [albums, setAlbums] = useState<Album[]>([])
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        const authParams = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body:
                "grant_type=client_credentials&client_id=" +
                clientId +
                "&client_secret=" +
                clientSecret,
        }

        fetch("https://accounts.spotify.com/api/token", authParams)
            .then((result) => result.json())
            .then((data) => {
                setAccessToken(data.access_token)
            })
    }, [])

    async function search() {
        if (!searchInput.trim() || !accessToken) return

        setIsSearching(true)
        const artistParams = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
        }

        try {
            // Get Artist
            const artistRes = await fetch(
                "https://api.spotify.com/v1/search?q=" + encodeURIComponent(searchInput) + "&type=artist",
                artistParams
            )
            const artistData = await artistRes.json()
            const artistID = artistData.artists?.items?.[0]?.id

            if (!artistID) {
                setAlbums([])
                return
            }

            // Get Artist Albums
            const albumsRes = await fetch(
                "https://api.spotify.com/v1/artists/" +
                artistID +
                "/albums?include_groups=album&market=US&limit=50",
                artistParams
            )
            const albumsData = await albumsRes.json()
            setAlbums(albumsData.items || [])
        } catch (error) {
            console.error("Erreur lors de la recherche:", error)
            setAlbums([])
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <div className="relative min-h-screen bg-black text-foreground">
            <Background
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
            />

            <div className="relative z-10">
                <Header user={user} onLogout={onLogout} />

                <main className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">Recherche</h1>
                        <p className="text-xl text-muted-foreground">Recherchez vos artistes préférés</p>
                    </div>

                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Rechercher un artiste..."
                                aria-label="Rechercher un artiste"
                                value={searchInput}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        search()
                                    }
                                }}
                                onChange={(event) => setSearchInput(event.target.value)}
                                className="flex-1 px-4 py-3 rounded-lg bg-card/80 backdrop-blur-sm text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                            <button
                                onClick={search}
                                disabled={isSearching || !searchInput.trim()}
                                className="px-6 py-3 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                {isSearching ? (
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                )}
                                Rechercher
                            </button>
                        </div>
                    </div>

                    {albums.length > 0 && (
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6">Albums trouvés ({albums.length})</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {albums.map((album) => (
                                    <div
                                        key={album.id}
                                        className="bg-card/80 backdrop-blur-sm rounded-lg overflow-hidden border border-border hover:bg-accent transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                                    >
                                        <img
                                            src={album.images[0]?.url}
                                            alt={album.name}
                                            className="w-full aspect-square object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                                {album.name}
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                Sortie: <span className="text-foreground">{album.release_date}</span>
                                            </p>
                                            <a
                                                href={album.external_urls.spotify}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center bg-green-500 hover:bg-green-400 text-black font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                                            >
                                                Ouvrir sur Spotify
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {albums.length === 0 && searchInput && !isSearching && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">Aucun album trouvé. Essayez une autre recherche.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
