import React from "react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/custom/product-card"

interface Product {
  id: number
  name: string
  price: number
  rating: number
  reviews: number
  img: string
}

interface RecommendedSectionProps {
  products: Product[]
}

const RecommendedSection = ({ products }: RecommendedSectionProps) => {
  return (
    <section className="bg-white p-4 md:p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recommended for You</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button variant="outline" className="w-full md:w-auto px-12 border-slate-300">
          See personalized recommendations
        </Button>
      </div>
    </section>
  )
}

export default RecommendedSection