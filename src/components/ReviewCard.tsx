import type { DbReviewWithProfile } from "@/lib/supabase"
import StarRating from "./StarRating"
import { Trash2 } from "lucide-react"

interface ReviewCardProps {
  review: DbReviewWithProfile
  currentUserId: string
  onDelete?: (reviewId: string) => void
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  )
  if (seconds < 60) return "a l'instant"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `il y a ${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `il y a ${days}j`
  const months = Math.floor(days / 30)
  return `il y a ${months} mois`
}

export default function ReviewCard({
  review,
  currentUserId,
  onDelete,
}: ReviewCardProps) {
  const profile = review.profiles
  const isOwner = currentUserId === review.spotify_user_id

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
      {/* Header: avatar + name + date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-white">
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-white font-medium text-sm">
            {profile.display_name}
          </span>
          <span className="text-zinc-500 text-xs">
            {timeAgo(review.created_at)}
          </span>
        </div>
        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="text-zinc-500 hover:text-red-400 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Track info */}
      <div className="flex gap-4 mb-3">
        {review.track_album_image && (
          <img
            src={review.track_album_image}
            alt={review.track_album}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0">
          <p className="text-white font-semibold truncate">
            {review.track_name}
          </p>
          <p className="text-zinc-400 text-sm truncate">
            {review.track_artist}
          </p>
          <p className="text-zinc-500 text-xs truncate">
            {review.track_album}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-2">
        <StarRating value={review.rating} size={18} showValue />
      </div>

      {/* Review text */}
      {review.review_text && (
        <p className="text-zinc-300 text-sm leading-relaxed">
          {review.review_text}
        </p>
      )}
    </div>
  )
}
