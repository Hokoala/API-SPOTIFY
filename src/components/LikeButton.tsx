import { Heart } from "lucide-react"

interface LikeButtonProps {
  liked: boolean
  count: number
  onToggle: () => void
}

export default function LikeButton({ liked, count, onToggle }: LikeButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 transition-colors group"
    >
      <Heart
        size={18}
        className={
          liked
            ? "fill-red-500 text-red-500"
            : "text-zinc-500 group-hover:text-red-400"
        }
      />
      {count > 0 && (
        <span
          className={`text-xs ${liked ? "text-red-400" : "text-zinc-500"}`}
        >
          {count}
        </span>
      )}
    </button>
  )
}
