import { useState, useEffect } from "react"
import { Artist } from "../App"
import { Users, ChevronRight, ExternalLink } from "lucide-react"

interface SimilarArtist {
    id: string
    name: string
    images: { url: string }[]
    genres: string[]
    popularity: number
}

interface SimilarArtistsProps {
    artists: Artist[]
    token: string
}

export function SimilarArtists({ artists, token }: SimilarArtistsProps) {
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
    const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([])
    const [loading, setLoading] = useState(false)
    const [useFallback, setUseFallback] = useState(false)

    useEffect(() => {
        if (artists.length > 0 && !selectedArtist) {
            setSelectedArtist(artists[0])
        }
    }, [artists])

    useEffect(() => {
        const fetchSimilarArtists = async () => {
            if (!selectedArtist || !token) return

            setLoading(true)
            setUseFallback(false)
            try {
                const response = await fetch(
                    `https://api.spotify.com/v1/artists/${selectedArtist.id}/related-artists`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                if (response.ok) {
                    const data = await response.json()
                    const relatedArtists = data.artists?.slice(0, 6) || []

                    if (relatedArtists.length > 0) {
                        setSimilarArtists(relatedArtists)
                    } else {
                        // Fallback: show other top artists with same genre
                        const selectedGenres = selectedArtist.genres || []
                        const fallbackArtists = artists
                            .filter(a => a.id !== selectedArtist.id)
                            .filter(a => {
                                if (selectedGenres.length === 0) return true
                                return a.genres.some(g => selectedGenres.includes(g))
                            })
                            .slice(0, 6)
                            .map(a => ({
                                id: a.id,
                                name: a.name,
                                images: a.images,
                                genres: a.genres,
                                popularity: a.popularity
                            }))

                        if (fallbackArtists.length > 0) {
                            setSimilarArtists(fallbackArtists)
                            setUseFallback(true)
                        } else {
                            // Last resort: just show other top artists
                            const otherArtists = artists
                                .filter(a => a.id !== selectedArtist.id)
                                .slice(0, 6)
                                .map(a => ({
                                    id: a.id,
                                    name: a.name,
                                    images: a.images,
                                    genres: a.genres,
                                    popularity: a.popularity
                                }))
                            setSimilarArtists(otherArtists)
                            setUseFallback(true)
                        }
                    }
                } else {
                    // API error, use fallback
                    const fallbackArtists = artists
                        .filter(a => a.id !== selectedArtist.id)
                        .slice(0, 6)
                        .map(a => ({
                            id: a.id,
                            name: a.name,
                            images: a.images,
                            genres: a.genres,
                            popularity: a.popularity
                        }))
                    setSimilarArtists(fallbackArtists)
                    setUseFallback(true)
                }
            } catch (error) {
                console.error("Error fetching similar artists:", error)
                // Use fallback on error
                const fallbackArtists = artists
                    .filter(a => a.id !== selectedArtist.id)
                    .slice(0, 6)
                    .map(a => ({
                        id: a.id,
                        name: a.name,
                        images: a.images,
                        genres: a.genres,
                        popularity: a.popularity
                    }))
                setSimilarArtists(fallbackArtists)
                setUseFallback(true)
            } finally {
                setLoading(false)
            }
        }

        fetchSimilarArtists()
    }, [selectedArtist, token, artists])

    if (artists.length === 0) return null

    return (
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-green-500" />
                <h2 className="text-base font-bold text-white">Artistes Similaires</h2>
            </div>

            {/* Artist selector */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2">
                {artists.slice(0, 5).map((artist) => (
                    <button
                        key={artist.id}
                        onClick={() => setSelectedArtist(artist)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full whitespace-nowrap transition-all text-xs ${
                            selectedArtist?.id === artist.id
                                ? "bg-green-500 text-black"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                    >
                        {artist.images[0] && (
                            <img
                                src={artist.images[0].url}
                                alt={artist.name}
                                className="w-5 h-5 rounded-full object-cover"
                            />
                        )}
                        <span className="font-medium">{artist.name}</span>
                    </button>
                ))}
            </div>

            {/* Selected artist info */}
            {selectedArtist && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl mb-4">
                    {selectedArtist.images[0] && (
                        <img
                            src={selectedArtist.images[0].url}
                            alt={selectedArtist.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{selectedArtist.name}</h3>
                        <p className="text-xs text-zinc-400 truncate">
                            {selectedArtist.genres.slice(0, 2).join(", ") || "Aucun genre"}
                        </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
            )}

            {/* Similar artists list */}
            {useFallback && (
                <p className="text-xs text-zinc-500 mb-2">
                    Artistes du meme style dans vos favoris
                </p>
            )}
            {loading ? (
                <div className="flex items-center justify-center h-20">
                    <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="space-y-2">
                    {similarArtists.map((artist) => (
                        <a
                            key={artist.id}
                            href={`https://open.spotify.com/artist/${artist.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-all"
                        >
                            <div className="relative flex-shrink-0">
                                {artist.images[0] ? (
                                    <img
                                        src={artist.images[0].url}
                                        alt={artist.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-zinc-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white truncate">{artist.name}</h4>
                                <p className="text-xs text-zinc-400 truncate">
                                    {artist.genres[0] || "Artiste"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1 bg-zinc-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${artist.popularity}%` }}
                                    />
                                </div>
                                <ExternalLink className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </a>
                    ))}
                </div>
            )}

        </div>
    )
}
