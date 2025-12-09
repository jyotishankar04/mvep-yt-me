import React from "react"
import HeroCarousel from "@/components/custom/hero-carousel"
import CategoryGrid from "@/components/sections/category-grid"
import DealsSection from "@/components/sections/deal-section"
import SellerBanner from "@/components/sections/seller-banner"
import RecommendedSection from "@/components/sections/recomended-section"
import HistoryStrip from "@/components/sections/history-strip"
import {
  HERO_SLIDES,
  DEALS_PRODUCTS,
  RECOMMENDED_PRODUCTS
} from "@/components/data/constants"

export default function HomePage() {
  return (
    <div className="max-w-[1500px] mx-auto pb-10">
      <HeroCarousel slides={HERO_SLIDES} />
      
      <div className="container mx-auto px-4 -mt-16 relative z-10 space-y-8">
        <CategoryGrid />
        <DealsSection deals={DEALS_PRODUCTS} />
        <SellerBanner />
        <RecommendedSection products={RECOMMENDED_PRODUCTS} />
        <HistoryStrip />
      </div>
    </div>
  )
}