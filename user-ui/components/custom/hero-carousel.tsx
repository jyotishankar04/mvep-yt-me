"use client"

import React, { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Slide {
  id: number
  title: string
  sub: string
  bg: string
  img: string
}

interface HeroCarouselProps {
  slides: Slide[]
}

const HeroCarousel = ({ slides }: HeroCarouselProps) => {
  const carouselPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  return (
    <div className="relative group">
      <Carousel 
        className="w-full"
        plugins={[carouselPlugin.current]}
        opts={{ align: "start", loop: true }}
        onMouseEnter={carouselPlugin.current.stop}
        onMouseLeave={carouselPlugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] overflow-hidden cursor-pointer">
                <img 
                  src={slide.img} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-8 md:p-16 text-white`}>
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{slide.title}</h2>
                  <p className="text-lg md:text-xl font-medium drop-shadow-md mb-4">{slide.sub}</p>
                  <Button className="w-fit bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold border-none">
                    Check it out
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 h-12 w-12 border-none bg-black/20 hover:bg-black/40 text-white" />
        <CarouselNext className="right-4 h-12 w-12 border-none bg-black/20 hover:bg-black/40 text-white" />
      </Carousel>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
    </div>
  )
}

export default HeroCarousel