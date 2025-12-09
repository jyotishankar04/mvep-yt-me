import React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import DealCard from "@/components/custom/deal-card"

interface Product {
  id: number
  name: string
  price: number
  oldPrice: number
  discount: string
  img: string
}

interface DealsSectionProps {
  deals: Product[]
}

const DealsSection = ({ deals }: DealsSectionProps) => {
  return (
    <section className="bg-white p-4 md:p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-3">
          Today Deals 
          <span className="text-xs font-normal text-blue-600 hover:underline cursor-pointer">See all deals</span>
        </h2>
      </div>
      
      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {deals.map((prod) => (
            <CarouselItem key={prod.id} className="pl-4 basis-40 md:basis-[220px]">
              <DealCard product={prod} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}

export default DealsSection