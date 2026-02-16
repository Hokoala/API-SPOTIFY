import { useState } from "react"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
  showValue?: boolean
}

export default function StarRating({
  value,
  onChange,
  size = 24,
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const displayValue = hoverValue ?? value
  const interactive = !!onChange

  return (
    <div className="flex items-center gap-1">
      <div
        className="flex"
        onMouseLeave={() => interactive && setHoverValue(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const fillPercent =
            displayValue >= star
              ? 100
              : displayValue >= star - 0.5
                ? 50
                : 0

          return (
            <div
              key={star}
              className={`relative ${interactive ? "cursor-pointer" : ""}`}
              style={{ width: size, height: size }}
            >
              {interactive && (
                <>
                  {/* Left half = X.5 */}
                  <div
                    className="absolute inset-y-0 left-0 w-1/2 z-10"
                    onMouseEnter={() => setHoverValue(star - 0.5)}
                    onClick={() => onChange(star - 0.5)}
                  />
                  {/* Right half = X.0 */}
                  <div
                    className="absolute inset-y-0 right-0 w-1/2 z-10"
                    onMouseEnter={() => setHoverValue(star)}
                    onClick={() => onChange(star)}
                  />
                </>
              )}
              {/* Background star (empty) */}
              <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                className="text-zinc-600"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {/* Filled star (clipped) */}
              {fillPercent > 0 && (
                <svg
                  viewBox="0 0 24 24"
                  width={size}
                  height={size}
                  className="text-green-400 absolute inset-0"
                  fill="currentColor"
                  style={{
                    clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
                  }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            </div>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm text-zinc-400 ml-1">
          {displayValue > 0 ? displayValue.toFixed(1) : ""}
        </span>
      )}
    </div>
  )
}
