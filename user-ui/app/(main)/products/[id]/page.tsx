"use client"

import React, { useState } from "react"
import { Star, MapPin, ShieldCheck, Truck, RotateCcw, Share2, Heart, Lock, Minus, Plus, ShoppingCart, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// --- Mock Data for a single product ---
const PRODUCT = {
  title: "Apple iPhone 15 Pro (128 GB) - Natural Titanium",
  brand: "Apple",
  rating: 4.6,
  reviews: 12453,
  price: 134900,
  oldPrice: 144900,
  emi: "6,540",
  images: [
    "https://placehold.co/600x600/f1f5f9/475569?text=iPhone+Front",
    "https://placehold.co/600x600/f1f5f9/475569?text=iPhone+Back",
    "https://placehold.co/600x600/f1f5f9/475569?text=iPhone+Side",
    "https://placehold.co/600x600/f1f5f9/475569?text=Camera+Detail",
  ],
  specs: [
    { label: "Brand", value: "Apple" },
    { label: "Model Name", value: "iPhone 15 Pro" },
    { label: "Network", value: "Unlocked for All Carriers" },
    { label: "OS", value: "iOS 17" },
    { label: "Cellular", value: "5G" },
  ]
}

export default function ProductPage() {
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)

  return (
    <div className="min-h-screen bg-white pb-12">
      
      {/* 1. Breadcrumb Strip */}
      <div className="bg-slate-50 border-b py-2 px-4 text-xs text-slate-600 mb-6">
         <span className="hover:underline cursor-pointer">Electronics</span> &rsaquo; 
         <span className="hover:underline cursor-pointer"> Mobiles & Accessories</span> &rsaquo; 
         <span className="hover:underline cursor-pointer"> Smartphones</span> &rsaquo; 
         <span className="font-bold   "> {PRODUCT.title}</span>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT: IMAGES (4 cols) ================= */}
          <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
             {/* Thumbnails */}
             <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {PRODUCT.images.map((img, i) => (
                   <div 
                     key={i} 
                     onMouseEnter={() => setActiveImg(i)}
                     className={`w-16 h-16 border rounded cursor-pointer p-1 ${activeImg === i ? 'border-blue-600 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-400'}`}
                   >
                     <img src={img} className="w-full h-full object-contain" alt="thumb"/>
                   </div>
                ))}
             </div>
             
             {/* Main Image */}
             <div className="flex-1 relative aspect-[4/5] md:aspect-auto md:h-[600px] flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 p-4">
                <img src={PRODUCT.images[activeImg]} className="w-full h-full object-contain mix-blend-multiply" alt="Main" />
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full hover:bg-slate-100">
                   <Share2 className="h-5 w-5 text-slate-500" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute top-12 right-2 rounded-full hover:bg-slate-100">
                   <Heart className="h-5 w-5 text-slate-500" />
                </Button>
             </div>
          </div>

          {/* ================= MIDDLE: INFO (4 cols) ================= */}
          <div className="lg:col-span-4 space-y-4">
             <div className="space-y-1">
                <h1 className="text-2xl font-bold    leading-tight">{PRODUCT.title}</h1>
                <div className="text-sm text-blue-600 hover:underline cursor-pointer">Visit the Apple Store</div>
                <div className="flex items-center gap-2">
                   <div className="flex text-orange-400 text-sm">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                   </div>
                   <span className="text-sm text-blue-600 hover:underline">{PRODUCT.reviews.toLocaleString()} ratings</span>
                   <span className="text-sm text-slate-300">|</span>
                   <span className="text-sm text-blue-600">Search this page</span>
                </div>
             </div>

             <Separator />

             <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <span className="text-red-600 text-xl font-light">-14%</span>
                   <span className="text-3xl font-bold   ">₹{PRODUCT.price.toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-500">M.R.P.: <span className="line-through">₹{PRODUCT.oldPrice.toLocaleString()}</span></div>
                <div className="text-sm   ">Inclusive of all taxes</div>
                <div className="text-sm    mt-2"><span className="font-bold">EMI</span> starts at ₹{PRODUCT.emi}. No Cost EMI available.</div>
             </div>

             <Separator />

             {/* Offers */}
             <div className="space-y-3">
                <div className="flex items-start gap-3">
                   <div className="mt-1"><Zap className="h-4 w-4 text-orange-600 fill-orange-600" /></div>
                   <div>
                      <span className="font-bold text-sm">Partner Offers</span>
                      <p className="text-sm text-slate-600 line-clamp-2">Get GST invoice and save up to 28% on business purchases.</p>
                   </div>
                </div>
             </div>

             <Separator />
             
             {/* Service Icons */}
             <div className="grid grid-cols-4 gap-2 text-center text-xs text-blue-600">
                <div className="flex flex-col items-center gap-1">
                   <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700"><RotateCcw className="h-5 w-5"/></div>
                   <span>7 days Replacement</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                   <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700"><Truck className="h-5 w-5"/></div>
                   <span>Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                   <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700"><ShieldCheck className="h-5 w-5"/></div>
                   <span>1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                   <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700"><Lock className="h-5 w-5"/></div>
                   <span>Secure Transaction</span>
                </div>
             </div>

             <Separator />

             {/* Spec Table */}
             <div className="text-sm">
                {PRODUCT.specs.map((spec, i) => (
                   <div key={i} className="grid grid-cols-2 py-1 gap-4">
                      <span className="text-slate-500 font-bold">{spec.label}</span>
                      <span className="  ">{spec.value}</span>
                   </div>
                ))}
             </div>

             <div className="pt-2">
                <h4 className="font-bold text-sm mb-2">About this item</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-700">
                   <li>FORGED IN TITANIUM — iPhone 15 Pro has a strong and light aerospace-grade titanium design with a textured matte-glass back.</li>
                   <li>ADVANCED DISPLAY — The 6.1-inch Super Retina XDR display with ProMotion ramps up refresh rates to 120Hz when you need exceptional graphics performance.</li>
                   <li>A17 PRO CHIP — A Pro-class GPU makes mobile games feel so immersive, with rich environments and realistic characters.</li>
                </ul>
             </div>
          </div>

          {/* ================= RIGHT: BUY BOX (3 cols) ================= */}
          <div className="lg:col-span-3">
             <Card className="shadow-md border-slate-200 sticky top-24">
                <CardContent className="p-4 space-y-4">
                   <div className="text-xl font-bold">₹{PRODUCT.price.toLocaleString()}</div>
                   
                   <div className="text-sm">
                      <span className="text-blue-600 font-bold italic">Prime</span>
                      <span className="text-slate-600 ml-1">FREE delivery</span> <span className="font-bold">Tomorrow, 11 AM</span>. 
                      <div className="text-blue-600 hover:underline text-xs mt-1 cursor-pointer">Details</div>
                   </div>

                   <div className="text-sm flex items-center gap-1 text-slate-700">
                      <MapPin className="h-4 w-4" /> 
                      <span className="text-blue-600 hover:underline cursor-pointer">Deliver to Rahul - Bhubaneswar 751024</span>
                   </div>

                   <div className="text-lg text-green-700 font-medium">In stock</div>

                   <div className="text-sm text-slate-600">
                      Sold by <span className="text-blue-600 hover:underline cursor-pointer">Appario Retail Private Ltd</span> and <span className="text-blue-600 hover:underline cursor-pointer">Fulfilled by MarketHub</span>.
                   </div>

                   <div className="flex items-center gap-2">
                      <Label htmlFor="qty" className="text-sm">Quantity:</Label>
                      <Select defaultValue="1">
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue placeholder="1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-2 pt-2">
                      <Button className="w-full      hover:  rounded-full font-normal shadow-sm">
                         Add to Cart
                      </Button>
                      <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 rounded-full font-normal shadow-sm">
                         Buy Now
                      </Button>
                   </div>

                   <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                      <Lock className="h-4 w-4 text-slate-400" /> Secure transaction
                   </div>

                   <div className="pt-2">
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <input type="checkbox" className="mt-1" />
                        <span>Add Gift Options</span>
                      </div>
                   </div>
                   
                   <Separator />
                   
                   <Button variant="outline" className="w-full text-sm">Add to Wish List</Button>

                </CardContent>
             </Card>
          </div>

        </div>

        {/* ================= BOTTOM: REVIEWS & MORE ================= */}
        <div className="mt-12 border-t pt-8">
           <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
           <div className="flex flex-col md:flex-row gap-12">
              
              {/* Rating Summary */}
              <div className="w-full md:w-1/4 space-y-4">
                 <div className="flex items-center gap-2">
                    <div className="flex text-orange-400">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-current" />)}
                    </div>
                    <span className="text-lg font-bold">4.6 out of 5</span>
                 </div>
                 <div className="text-slate-500 text-sm">12,453 global ratings</div>
                 
                 <div className="space-y-2 mt-4">
                    {[5,4,3,2,1].map((star, i) => (
                       <div key={star} className="flex items-center gap-3 text-sm hover:text-blue-600 cursor-pointer group">
                          <span className="w-12">{star} star</span>
                          <div className="flex-1 h-5 bg-slate-100 rounded-sm overflow-hidden border border-slate-200 shadow-inner">
                             <div 
                                className="h-full bg-orange-400" 
                                style={{width: i === 0 ? '70%' : i === 1 ? '20%' : '5%'}} 
                             />
                          </div>
                          <span className="w-8 text-right text-slate-600">{i === 0 ? '70%' : i === 1 ? '20%' : '5%'}</span>
                       </div>
                    ))}
                 </div>

                 <Separator className="my-6" />
                 
                 <h3 className="font-bold mb-2">Review this product</h3>
                 <p className="text-sm text-slate-600 mb-4">Share your thoughts with other customers</p>
                 <Button variant="outline" className="w-full border-slate-300">Write a product review</Button>
              </div>

              {/* Review List */}
              <div className="flex-1 space-y-6">
                 {[1, 2, 3].map((rev) => (
                    <div key={rev} className="space-y-2">
                       <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">U</div>
                          <span className="text-sm font-medium">MarketHub Customer</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="flex text-orange-400 text-xs">
                            {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-current" />)}
                          </div>
                          <span className="font-bold text-sm">Best iPhone yet!</span>
                       </div>
                       <div className="text-xs text-slate-500">Reviewed in India on 15 August 2024</div>
                       <div className="text-xs text-orange-700 font-bold">Verified Purchase</div>
                       <p className="text-sm text-slate-700 leading-relaxed">
                          The titanium build feels amazing in hand. Much lighter than the 14 Pro. The camera upgrade is noticeable, especially in low light. Battery life comfortably lasts a day. Highly recommended!
                       </p>
                       <div className="flex items-center gap-4 text-sm text-slate-500 pt-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs">Helpful</Button>
                          <span className="text-xs cursor-pointer hover:underline">Report</span>
                       </div>
                    </div>
                 ))}
                 <div className="pt-4">
                    <Link href="#" className="text-blue-600 font-bold hover:underline">See all reviews</Link>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  )
}
