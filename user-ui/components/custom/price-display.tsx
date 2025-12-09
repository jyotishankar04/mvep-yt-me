import React from "react"

interface PriceDisplayProps {
  price: number
  oldPrice?: number
  currency?: string
  size?: "sm" | "md" | "lg"
  showDiscount?: boolean
}

const PriceDisplay = ({ 
  price, 
  oldPrice, 
  currency = "₹", 
  size = "md", 
  showDiscount = true 
}: PriceDisplayProps) => {
  const sizeClasses = {
    sm: { current: "text-sm", old: "text-xs" },
    md: { current: "text-lg", old: "text-sm" },
    lg: { current: "text-2xl", old: "text-base" }
  }

  const discount = oldPrice 
    ? Math.round(((oldPrice - price) / oldPrice) * 100) 
    : 0

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2">
        <span className={`font-bold ${sizeClasses[size].current}`}>
          {currency}{price.toLocaleString()}
        </span>
        {oldPrice && (
          <span className={`text-muted-foreground line-through ${sizeClasses[size].old}`}>
            {currency}{oldPrice.toLocaleString()}
          </span>
        )}
      </div>
      {showDiscount && discount > 0 && (
        <span className="text-xs text-green-600 font-medium mt-1">
          Save {currency}{(oldPrice! - price).toLocaleString()} ({discount}%)
        </span>
      )}
    </div>
  )
}

export default PriceDisplay