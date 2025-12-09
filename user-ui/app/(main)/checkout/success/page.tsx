"use client"

import Link from "next/link"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
       <div className="container mx-auto px-4 max-w-3xl">
          
          <Card className="border-green-500 border-t-4 shadow-sm">
             <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                   <CheckCircle2 className="h-12 w-12 text-green-600 flex-shrink-0" />
                   <div>
                      <h1 className="text-2xl font-bold text-green-700">Order placed, thank you!</h1>
                      <p className="text-slate-600">Confirmation will be sent to your email.</p>
                      
                      <div className="mt-2 text-sm">
                         <span className="font-bold text-slate-700">Shipping to Rahul Sharma</span>, Plot No 123...
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-6 flex justify-between items-center">
                   <div>
                      <div className="text-sm text-slate-500">Estimated Delivery</div>
                      <div className="font-bold text-lg text-slate-900">Tomorrow, 14 Aug</div>
                   </div>
                   <Link href="/account/orders">
                      <Button variant="outline" className="bg-white">Review or edit order</Button>
                   </Link>
                </div>

                <div className="flex gap-4 mb-6">
                   <div className="w-20 h-20 border bg-white p-2 flex items-center justify-center">
                      <img src="https://placehold.co/100x100/f1f5f9/475569?text=Item" className="max-h-full" />
                   </div>
                   <div className="w-20 h-20 border bg-white p-2 flex items-center justify-center opacity-50">
                      <img src="https://placehold.co/100x100/f1f5f9/475569?text=+1" className="max-h-full" />
                   </div>
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col sm:flex-row gap-4">
                   <Link href="/" className="flex-1">
                      <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                         Continue Shopping
                      </Button>
                   </Link>
                   <Link href="/account/orders" className="flex-1">
                      <Button variant="outline" className="w-full flex items-center gap-2">
                         <Package className="h-4 w-4" /> Go to Your Orders
                      </Button>
                   </Link>
                </div>

             </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card>
                <CardContent className="p-4 flex items-center gap-4">
                   <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">?</div>
                   <div>
                      <h3 className="font-bold">Need help?</h3>
                      <Link href="/help" className="text-sm text-blue-600 hover:underline">Contact Customer Service</Link>
                   </div>
                </CardContent>
             </Card>
             <Card>
                <CardContent className="p-4 flex items-center gap-4">
                   <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">%</div>
                   <div>
                      <h3 className="font-bold">Earn rewards</h3>
                      <Link href="#" className="text-sm text-blue-600 hover:underline">Check your points balance</Link>
                   </div>
                </CardContent>
             </Card>
          </div>

       </div>
    </div>
  )
}
