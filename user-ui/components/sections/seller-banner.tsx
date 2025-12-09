import React from "react"
import { Store } from "lucide-react"
import { Button } from "@/components/ui/button"

const SellerBanner = () => {
  return (
    <div className="w-full h-24 md:h-32 bg-slate-900 rounded-md flex items-center justify-between px-6 md:px-12 text-white overflow-hidden relative shadow-lg">
      <div className="z-10 space-y-1">
        <h3 className="text-xl md:text-2xl font-bold">Become a Seller</h3>
        <p className="text-slate-300 text-xs md:text-sm max-w-md">
          Start your business with MarketHub and reach crores of customers across India. 
          0% Commission for first 30 days.
        </p>
      </div>
      <div className="z-10 flex gap-4">
        <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold shadow-md">
          Start Selling
        </Button>
      </div>
      {/* Abstract Decor */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-600/20 to-transparent" />
      <Store className="absolute right-10 -bottom-8 h-40 w-40 text-white/5 rotate-12" />
    </div>
  )
}

export default SellerBanner