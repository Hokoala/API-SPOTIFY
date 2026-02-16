import { useState } from "react"
import StarRating from "./StarRating"
import type { Track } from "@/App"

interface ReviewFormProps {
  track: Track
  initialRating?: number
  initialText?: string
  onSubmit: (rating: number, text: string) => void
  onCancel: () => void
  submitting?: boolean
}

export default function ReviewForm({
  track,
  initialRating = 0,
  initialText = "",
  onSubmit,
  onCancel,
  submitting = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating)
  const [text, setText] = useState(initialText)

  const albumImage = track.album.images?.[0]?.url
  const artistName = track.artists.map((a) => a.name).join(", ")

  return (
    <div className="space-y-5">
      {/* Track info */}
      <div className="flex gap-4 items-center">
        {albumImage && (
          <img
            src={albumImage}
            alt={track.album.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <p className="text-white font-semibold truncate">{track.name}</p>
          <p className="text-zinc-400 text-sm truncate">{artistName}</p>
        </div>
      </div>

      {/* Star rating */}
      <div>
        <label className="text-zinc-400 text-sm mb-2 block">Ta note *</label>
        <StarRating value={rating} onChange={setRating} size={32} showValue />
      </div>

      {/* Text area */}
      <div>
        <label className="text-zinc-400 text-sm mb-2 block">
          Ton avis (optionnel)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ecris ton avis..."
          rows={4}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-green-500 resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors text-sm"
        >
          Annuler
        </button>
        <button
          onClick={() => rating > 0 && onSubmit(rating, text)}
          disabled={rating === 0 || submitting}
          className="px-5 py-2 rounded-lg bg-green-500 text-black font-semibold text-sm hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Publication..." : "Publier"}
        </button>
      </div>
    </div>
  )
}
