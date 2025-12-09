import React from "react"
import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showNumber?: boolean
}

const RatingStars = ({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showNumber = false 
}: RatingStarsProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-orange-400">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1
          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                starValue <= Math.floor(rating)
                  ? "fill-current"
                  : starValue <= rating
                  ? "fill-current opacity-50"
                  : "text-slate-300 fill-current"
              }`}
            />
          )
        })}
      </div>
      {showNumber && (
        <span className="text-xs text-slate-600 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

export default RatingStars