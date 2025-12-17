"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Check, Minus, Plus, Trash2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

// Mock Cart Data
const INITIAL_CART = [
  { 
    id: 1, 
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", 
    price: 24990, 
    stock: "In Stock",
    image: "https://placehold.co/150x150/f1f5f9/475569?text=Headphones",
    delivery: "Tomorrow, 11 AM",
    qty: 1
  },
  { 
    id: 2, 
    name: "Apple 20W USB-C Power Adapter (iPhone Charger)", 
    price: 1699, 
    stock: "In Stock",
    image: "https://placehold.co/150x150/f1f5f9/475569?text=Adapter",
    delivery: "Sunday, 12 Aug",
    qty: 2
  }
]

export default function CartPage() {
  const [cart, setCart] = useState(INITIAL_CART)

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ))
  }

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0)
  const count = cart.reduce((acc, item) => acc + item.qty, 0)

  if (cart.length === 0) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Your MarketHub Cart is empty.</h1>
            <Link href="/">
                <Button className="     hover: ">Shop today&apos;s deals</Button>
            </Link>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
       <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Cart Items */}
          <div className="lg:col-span-9">
             <Card className="shadow-sm border-slate-200 rounded-none md:rounded-lg">
                <CardContent className="p-6">
                   <div className="flex justify-between items-end mb-4">
                      <h1 className="text-2xl font-bold">Shopping Cart</h1>
                      <span className="text-sm text-slate-500 hidden md:inline text-right w-24">Price</span>
                   </div>
                   <Separator />
                   
                   {cart.map((item) => (
                      <div key={item.id} className="py-6 border-b last:border-0 flex flex-col md:flex-row gap-4">
                         {/* Image */}
                         <div className="w-full md:w-48 h-48 flex-shrink-0 bg-slate-100 flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="max-h-full mix-blend-multiply" />
                         </div>
                         
                         {/* Details */}
                         <div className="flex-1 space-y-2">
                            <div className="flex justify-between">
                               <Link href="#" className="font-medium text-lg leading-tight hover:text-blue-600 hover:underline line-clamp-2">
                                  {item.name}
                               </Link>
                               <span className="font-bold text-lg md:hidden">₹{item.price.toLocaleString()}</span>
                            </div>
                            
                            <div className="text-xs text-green-700 font-medium">{item.stock}</div>
                            <div className="text-xs text-slate-500">Eligible for FREE Shipping</div>
                            <div className="flex items-center gap-1 text-xs">
                               <Checkbox id={`gift-${item.id}`} />
                               <label htmlFor={`gift-${item.id}`}>This is a gift</label>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                               <div className="flex items-center border rounded-md shadow-sm">
                                  <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border-r"><Minus className="h-3 w-3" /></button>
                                  <span className="px-4 text-sm font-bold">{item.qty}</span>
                                  <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border-l"><Plus className="h-3 w-3" /></button>
                               </div>
                               <Separator orientation="vertical" className="h-4" />
                               <button onClick={() => removeItem(item.id)} className="text-sm text-blue-600 hover:underline">Delete</button>
                               <Separator orientation="vertical" className="h-4" />
                               <button className="text-sm text-blue-600 hover:underline">Save for later</button>
                            </div>
                         </div>

                         {/* Price (Desktop) */}
                         <div className="hidden md:block w-24 text-right font-bold text-lg">
                            ₹{item.price.toLocaleString()}
                         </div>
                      </div>
                   ))}

                   <div className="text-right pt-4 text-lg">
                      Subtotal ({count} items): <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* RIGHT: Checkout Box */}
          <div className="lg:col-span-3">
             <Card className="shadow-sm border-slate-200 sticky top-24">
                <CardContent className="p-4 space-y-4">
                   <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <Check className="h-4 w-4 bg-green-700 text-white rounded-full p-0.5" />
                      <span>Part of your order qualifies for FREE Delivery.</span>
                   </div>
                   
                   <div className="text-lg">
                      Subtotal ({count} items): <br/>
                      <span className="font-bold text-xl">₹{subtotal.toLocaleString()}</span>
                   </div>

                   <div className="flex items-center gap-2 text-sm">
                      <Checkbox id="gift-all" />
                      <label htmlFor="gift-all">This order contains a gift</label>
                   </div>

                   <Button className="w-full      hover:  font-normal shadow-sm">
                      Proceed to Buy
                   </Button>

                   <Separator />

                   <Button variant="outline" className="w-full bg-slate-100 border-slate-300">
                      EMI Available
                   </Button>
                </CardContent>
             </Card>
          </div>

       </div>
    </div>
  )
}
