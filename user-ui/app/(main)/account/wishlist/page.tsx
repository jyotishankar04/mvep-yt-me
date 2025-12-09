"use client"

import React from "react"
import { MoreHorizontal, Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen bg-white">
       <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar List Selector */}
          <div className="w-full md:w-64 flex-shrink-0 bg-slate-50 p-4 rounded-lg h-fit">
             <Button className="w-full bg-slate-200 text-slate-800 hover:bg-slate-300 mb-4">+ Create a List</Button>
             <div className="space-y-1">
                <div className="flex items-center justify-between p-2 bg-white rounded shadow-sm border-l-4 border-orange-500 cursor-pointer">
                   <span className="font-bold text-sm">Shopping List</span>
                   <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">Private</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-white rounded cursor-pointer">
                   <span className="text-sm">Wish List</span>
                   <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">Public</span>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
             <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h1 className="text-2xl font-bold">Shopping List</h1>
                <div className="flex items-center gap-2">
                   <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      <Input placeholder="Search list" className="pl-9 w-48" />
                   </div>
                   <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                </div>
             </div>

             <div className="space-y-4">
                {[1, 2, 3].map((item, i) => (
                   <Card key={i} className="rounded-none border-x-0 border-t-0 border-b shadow-none last:border-0 hover:bg-slate-50 transition-colors">
                      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start">
                         <div className="w-32 h-32 flex-shrink-0 border bg-white flex items-center justify-center p-2">
                            <img src={`https://placehold.co/150x150/f1f5f9/475569?text=Item+${i+1}`} className="max-h-full mix-blend-multiply" />
                         </div>
                         <div className="flex-1 space-y-1">
                            <h3 className="font-bold text-blue-600 hover:underline cursor-pointer text-lg">
                               Running Shoes for Men - Grey/Blue
                            </h3>
                            <div className="flex items-baseline gap-2">
                               <span className="text-lg font-bold text-red-700">₹1,499.00</span>
                               <span className="text-xs line-through text-slate-500">₹2,999.00</span>
                               <span className="text-xs text-green-700 font-bold">Price dropped 5%</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                               <Avatar className="h-4 w-4"><AvatarImage src="https://github.com/shadcn.png"/></Avatar>
                               Added 2 days ago
                            </div>
                         </div>
                         <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-normal">
                               Add to Cart
                            </Button>
                            <Button variant="outline" size="sm">Delete</Button>
                         </div>
                      </CardContent>
                   </Card>
                ))}
             </div>
          </div>
       </div>
    </div>
  )
}
