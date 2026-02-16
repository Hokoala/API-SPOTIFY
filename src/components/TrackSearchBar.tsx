import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import type { Track } from "@/App"

interface TrackSearchBarProps {
  token: string
  onSelectTrack: (track: Track) => void
}

export default function TrackSearchBar({
  token,
  onSelectTrack,
}: TrackSearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Track[]>([])
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/search?type=track&limit=10&q=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (res.ok) {
          const data = await res.json()
          setResults(data.tracks?.items ?? [])
          setOpen(true)
        }
      } catch (err) {
        console.error("Search error:", err)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, token])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (track: Track) => {
    onSelectTrack(track)
    setQuery("")
    setResults([])
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={18}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Rechercher un titre..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-green-500"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-40 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-xl max-h-80 overflow-y-auto">
          {results.map((track) => (
            <button
              key={track.id}
              onClick={() => handleSelect(track)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-700 transition-colors text-left"
            >
              {track.album.images?.[0]?.url && (
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-white text-sm truncate">{track.name}</p>
                <p className="text-zinc-400 text-xs truncate">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
