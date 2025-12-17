"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { Filter, Star, ChevronDown, Check, Heart, SlidersHorizontal, Loader2 } from "lucide-react"

// Shadcn Components
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- Mock Data ---
const BRANDS = ["Samsung", "Apple", "Sony", "Boat", "OnePlus", "Xiaomi"]
const INITIAL_PRODUCTS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: i % 2 === 0 ? "Sony WH-1000XM5 Wireless Noise Cancelling Headphones" : "Samsung Galaxy S24 Ultra 5G AI Smartphone",
  price: i % 2 === 0 ? 24990 : 129999,
  oldPrice: i % 2 === 0 ? 29990 : 144999,
  rating: 4.5,
  reviews: 1234,
  image: `https://placehold.co/300x300/f1f5f9/475569?text=Product+${i+1}`,
  prime: i % 3 === 0,
  bestseller: i === 0 || i === 4,
  delivery: "Get it by Tomorrow, 11 AM"
}))

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // State
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  // --- 1. URL State Management ---
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "false" || value === "") {
         params.delete(name)
      } else {
         params.set(name, value)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (key: string, value: any) => {
    router.push(pathname + "?" + createQueryString(key, value), { scroll: false })
  }

  // --- 2. Infinite Scroll Logic ---
  const loadMoreProducts = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const newProducts = Array.from({ length: 4 }).map((_, i) => ({
      ...INITIAL_PRODUCTS[i % 2],
      id: products.length + i + 1,
      image: `https://placehold.co/300x300/f1f5f9/475569?text=Product+${products.length + i + 1}`
    }))

    setProducts((prev) => [...prev, ...newProducts])
    setLoading(false)
    
    // Stop after 40 products for demo
    if (products.length > 40) setHasMore(false)
  }

  useEffect(() => {
    if (inView) {
      loadMoreProducts()
    }
  }, [inView])

  // --- 3. Filter Sidebar Component ---
  const FilterSidebar = () => (
    <div className="space-y-6 pr-4">
      <div>
        <h3 className="font-bold mb-2 text-sm">Delivery Day</h3>
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox 
             id="prime" 
             checked={searchParams.get("prime") === "true"}
             onCheckedChange={(c) => handleFilterChange("prime", String(c))}
          />
          <label htmlFor="prime" className="text-sm leading-none flex items-center gap-1 text-blue-600 font-bold italic cursor-pointer">
            <Check className="h-3 w-3 text-orange-500" /> Prime
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="tomorrow" />
          <label htmlFor="tomorrow" className="text-sm leading-none text-slate-700 cursor-pointer">Get It by Tomorrow</label>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-bold mb-4 text-sm">Category</h3>
        <div className="space-y-2 text-sm text-slate-700 ml-2 border-l-2 pl-2 border-slate-200">
          <p className="font-bold    cursor-pointer">Electronics</p>
          <p className="cursor-pointer hover:text-blue-600">Headphones</p>
          <p className="cursor-pointer hover:text-blue-600">Mobiles</p>
          <p className="cursor-pointer hover:text-blue-600">Accessories</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-bold mb-4 text-sm">Price Range</h3>
        <Slider defaultValue={[20000]} max={150000} step={1000} className="mb-4" />
        <div className="flex items-center gap-2">
           <div className="border rounded px-2 py-1 text-sm w-20">₹1,000</div>
           <span className="text-slate-400">to</span>
           <div className="border rounded px-2 py-1 text-sm w-20">₹1.5L</div>
           <Button variant="outline" size="sm" className="h-8 px-2">Go</Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-bold mb-2 text-sm">Brand</h3>
        <div className="space-y-2">
          {BRANDS.map((b) => (
            <div key={b} className="flex items-center space-x-2">
              <Checkbox 
                 id={b} 
                 checked={searchParams.get("brand") === b}
                 onCheckedChange={(c) => handleFilterChange("brand", c ? b : "")}
              />
              <label htmlFor={b} className="text-sm text-slate-700 cursor-pointer hover:text-blue-600">{b}</label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-bold mb-2 text-sm">Customer Review</h3>
        {[4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <div className="flex text-orange-400">
              {Array.from({length: 5}).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < star ? 'fill-current' : 'text-slate-200'}`} />
              ))}
            </div>
            <span className="text-sm text-slate-600">& Up</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white container mx-auto px-4 py-4">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b pb-4 sticky top-16 bg-white z-20">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium   ">1-{products.length} of over 50,000 results</span> for <span className="font-bold text-orange-700">"Electronics"</span>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Mobile Filter Trigger */}
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)] mt-4">
                <FilterSidebar />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Select defaultValue="featured" onValueChange={(v) => handleFilterChange("sort", v)}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="low">Price: Low to High</SelectItem>
              <SelectItem value="high">Price: High to Low</SelectItem>
              <SelectItem value="new">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-6 relative">
        
        {/* Sticky Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
            <FilterSidebar />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 min-h-screen">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((prod) => (
              <Link href={`/products/${prod.id}`} key={prod.id} className="group">
                <Card className="h-full rounded-md overflow-hidden border border-slate-200 shadow-none hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-square bg-slate-100 p-6 flex items-center justify-center overflow-hidden">
                    <img src={prod.image} alt={prod.name} className="object-contain h-full w-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    {prod.bestseller && (
                      <div className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-md z-10 shadow-sm">
                        #1 Best Seller
                      </div>
                    )}
                    <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/60 text-slate-400 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <CardContent className="p-4 space-y-1.5">
                    <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-orange-700 transition-colors h-10">
                      {prod.name}
                    </h3>
                    
                    <div className="flex items-center gap-1">
                      <div className="flex text-orange-400">
                         {[1,2,3,4].map(s => <Star key={s} className="h-3 w-3 fill-current" />)}
                         <Star className="h-3 w-3 text-slate-300 fill-current" />
                      </div>
                      <span className="text-xs text-blue-600 hover:underline">{prod.reviews}</span>
                    </div>

                    <div className="pt-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">₹{prod.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground line-through">₹{prod.oldPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-700 font-bold">Save 15%</span>
                        {prod.prime && <span className="text-[10px] text-slate-500">with coupon</span>}
                      </div>
                    </div>

                    {prod.prime ? (
                      <div className="flex items-center gap-1 mt-1">
                         <span className="text-xs text-blue-600 font-bold italic">Prime</span>
                         <span className="text-[10px] text-slate-500 truncate">{prod.delivery}</span>
                      </div>
                    ) : (
                        <span className="text-[10px] text-slate-500 mt-1 block">Free delivery by Wed, 20 Aug</span>
                    )}

                    <Button className="w-full mt-3 h-8 text-xs      hover:  font-bold border-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
            
            {/* Loading Skeletons */}
            {loading && Array.from({ length: 4 }).map((_, i) => (
               <Card key={`skeleton-${i}`} className="h-full rounded-md border border-slate-100">
                  <div className="aspect-square bg-slate-50 p-6"><Skeleton className="h-full w-full" /></div>
                  <CardContent className="p-4 space-y-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-2/3" />
                     <Skeleton className="h-6 w-1/3 mt-2" />
                  </CardContent>
               </Card>
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={ref} className="w-full py-8 flex justify-center items-center">
               {!loading && <div className="h-10" />} {/* Invisible trigger buffer */}
            </div>
          )}
          
          {!hasMore && (
             <div className="text-center py-8 text-slate-400 text-sm">You&apos;ve reached the end of the results.</div>
          )}
        </main>
      </div>
    </div>
  )
}
