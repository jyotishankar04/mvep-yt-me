import React from "react"
import { Badge } from "@/components/ui/badge"

interface DealCardProps {
  product: {
    id: number
    name: string
    price: number
    oldPrice: number
    discount: string
    img: string
  }
}

const DealCard = ({ product }: DealCardProps) => {
  return (
    <div className="group cursor-pointer border border-transparent hover:border-slate-200 p-2 rounded-md transition-all">
      <div className="bg-slate-50 aspect-square rounded-md p-4 mb-2 flex items-center justify-center relative overflow-hidden">
        <img 
          src={product.img} 
          alt={product.name} 
          className="object-contain w-full h-full group-hover:scale-105 transition-transform mix-blend-multiply" 
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="rounded-sm px-1.5 text-[10px] font-bold">
            {product.discount}
          </Badge>
          <span className="text-xs text-red-600 font-bold">Deal</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.oldPrice.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-slate-600 truncate">{product.name}</p>
      </div>
    </div>
  )
}

export default DealCard