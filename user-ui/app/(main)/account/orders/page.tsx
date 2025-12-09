"use client"

import React from "react"
import Link from "next/link"
import { Search, PackageCheck, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl min-h-screen bg-white">
       <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <div className="flex gap-2 w-full max-w-sm">
             <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input placeholder="Search all orders" className="pl-9" />
             </div>
             <Button>Search</Button>
          </div>
       </div>

       <Tabs defaultValue="orders" className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none mb-6">
             <TabsTrigger value="orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:shadow-none px-6 py-3">Orders</TabsTrigger>
             <TabsTrigger value="buy-again" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:shadow-none px-6 py-3">Buy Again</TabsTrigger>
             <TabsTrigger value="cancelled" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:shadow-none px-6 py-3">Cancelled Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
             <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold">7 orders</span> placed in
                <Select defaultValue="3months">
                  <SelectTrigger className="w-[180px] h-8 text-xs">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">last 30 days</SelectItem>
                    <SelectItem value="3months">past 3 months</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
             </div>

             {/* Order Card 1 */}
             <Card className="border-slate-200 overflow-hidden">
                <CardHeader className="bg-slate-100 py-3 px-6 flex flex-row items-center justify-between text-xs md:text-sm text-slate-600 space-y-0">
                   <div className="flex gap-8">
                      <div>
                         <span className="block font-bold text-slate-700">ORDER PLACED</span>
                         8 August 2024
                      </div>
                      <div>
                         <span className="block font-bold text-slate-700">TOTAL</span>
                         ₹24,990
                      </div>
                      <div className="hidden md:block">
                         <span className="block font-bold text-slate-700">SHIP TO</span>
                         <span className="text-blue-600 hover:underline cursor-pointer">Rahul Sharma</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-bold text-slate-700">ORDER # 404-1234567-8901234</div>
                      <div className="flex gap-2 justify-end mt-1 text-blue-600">
                         <span className="hover:underline cursor-pointer">View Order Details</span>
                         <span>|</span>
                         <span className="hover:underline cursor-pointer">Invoice</span>
                      </div>
                   </div>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-24 h-24 flex-shrink-0 bg-slate-50 border rounded p-2">
                         <img src="https://placehold.co/100x100/f1f5f9/475569?text=Headphones" alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                         <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                            <span className="text-green-700">Arriving Tomorrow by 8 PM</span>
                         </h3>
                         <p className="text-sm text-slate-500 mb-2">Not yet dispatched</p>
                         <Link href="#" className="text-blue-600 hover:underline font-medium block mb-4">
                            Sony WH-1000XM5 Wireless Noise Cancelling Headphones
                         </Link>
                         <div className="flex gap-2">
                            <Button size="sm" className="bg-yellow-400 text-slate-900 hover:bg-yellow-500">Track package</Button>
                            <Button size="sm" variant="outline">View or edit order</Button>
                         </div>
                      </div>
                   </div>
                </CardContent>
             </Card>

             {/* Order Card 2 (Delivered) */}
             <Card className="border-slate-200 overflow-hidden">
                <CardHeader className="bg-slate-100 py-3 px-6 flex flex-row items-center justify-between text-xs md:text-sm text-slate-600 space-y-0">
                   <div className="flex gap-8">
                      <div><span className="block font-bold text-slate-700">ORDER PLACED</span>1 July 2024</div>
                      <div><span className="block font-bold text-slate-700">TOTAL</span>₹1,499</div>
                   </div>
                   <div className="text-right font-bold text-slate-700">ORDER # 111-9999999-0000000</div>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-24 h-24 flex-shrink-0 bg-slate-50 border rounded p-2">
                         <img src="https://placehold.co/100x100/f1f5f9/475569?text=Shirt" alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                         <h3 className="font-bold text-lg mb-1">Delivered 4 July 2024</h3>
                         <p className="text-sm text-slate-500 mb-2">Package was handed to resident</p>
                         <Link href="#" className="text-blue-600 hover:underline font-medium block mb-4">
                            Men's Cotton Casual Shirt - Regular Fit
                         </Link>
                         <div className="flex flex-wrap gap-2">
                            <Button size="sm" className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 flex items-center gap-1">
                               <RotateCcw className="h-3 w-3" /> Buy it again
                            </Button>
                            <Button size="sm" variant="outline">Write a product review</Button>
                            <Button size="sm" variant="outline">Archive order</Button>
                         </div>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>
       </Tabs>
    </div>
  )
}
