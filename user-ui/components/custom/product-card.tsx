import React from "react"
import { Star, Heart, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    rating: number
    reviews: number
    img: string
  }
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[1/1.1] bg-slate-50 border border-slate-100 rounded-md mb-2 overflow-hidden relative">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
        />
        <Button 
          size="icon" 
          variant="secondary" 
          className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white hover:text-red-500 shadow-sm"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <h3 className="text-sm font-medium leading-snug text-slate-800 line-clamp-2 hover:text-blue-600 h-10 mb-1">
        {product.name}
      </h3>
      
      <div className="flex items-center gap-1 mb-1">
        <div className="flex text-orange-400">
          {[1, 2, 3, 4].map((s) => (
            <Star key={s} className="h-3 w-3 fill-current" />
          ))}
          <Star className="h-3 w-3 text-slate-300 fill-current" />
        </div>
        <span className="text-xs text-blue-500">{product.reviews.toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
        <span className="text-[10px] text-slate-500 bg-slate-100 px-1 rounded">Prime</span>
      </div>
      <div className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
        <Truck className="h-3 w-3" />
        FREE Delivery by <span className="font-bold">Tomorrow</span>
      </div>
    </div>
  )
}

export default ProductCard