"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Lock, Plus, Truck, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const STEPS = {
  ADDRESS: 1,
  PAYMENT: 2,
  REVIEW: 3,
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(STEPS.ADDRESS)
  const [address, setAddress] = useState("addr1")
  const [payment, setPayment] = useState("card")

  return (
    <div className="min-h-screen bg-white">
       {/* Checkout Header */}
       <header className="border-b bg-slate-50 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
             <div className="font-bold text-2xl italic text-slate-900">MarketHub</div>
             <h1 className="text-xl font-normal text-slate-600">Checkout</h1>
             <Lock className="h-5 w-5 text-slate-400" />
          </div>
       </header>

       <div className="container mx-auto px-4 py-8 max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN COLUMN */}
          <div className="lg:col-span-8 space-y-6">
             
             {/* STEP 1: ADDRESS */}
             <div className={`border rounded-lg ${currentStep === STEPS.ADDRESS ? 'border-orange-500 shadow-sm' : 'border-slate-200'}`}>
                <div className="p-4 bg-slate-50 flex justify-between items-center cursor-pointer" onClick={() => setCurrentStep(STEPS.ADDRESS)}>
                   <h2 className={`font-bold ${currentStep === STEPS.ADDRESS ? 'text-orange-700' : 'text-slate-700'}`}>1. Select a delivery address</h2>
                   {currentStep > STEPS.ADDRESS && (
                      <div className="text-sm">
                         <div className="font-bold">Rahul Sharma</div>
                         <div className="text-slate-500 text-xs">Plot 123, Bhubaneswar...</div>
                      </div>
                   )}
                </div>
                
                {currentStep === STEPS.ADDRESS && (
                   <div className="p-6 bg-white border-t">
                      <RadioGroup value={address} onValueChange={setAddress} className="space-y-4">
                         <div className="flex items-start gap-3 p-3 border rounded-md border-orange-200 bg-orange-50">
                            <RadioGroupItem value="addr1" id="addr1" className="mt-1" />
                            <div className="space-y-1">
                               <Label htmlFor="addr1" className="font-bold text-base">Rahul Sharma</Label>
                               <div className="text-sm text-slate-600">Plot No 123, Khandagiri, Bhubaneswar, Odisha, 751030</div>
                               <div className="text-sm text-slate-600">Phone: 9876543210</div>
                               <div className="mt-2 text-xs text-blue-600 cursor-pointer hover:underline">Add delivery instructions</div>
                            </div>
                         </div>
                         <div className="flex items-start gap-3 p-3">
                            <RadioGroupItem value="addr2" id="addr2" className="mt-1" />
                            <div className="space-y-1">
                               <Label htmlFor="addr2" className="font-bold text-base">Rahul (Work)</Label>
                               <div className="text-sm text-slate-600">DLF Cyber City, Patia, Bhubaneswar, Odisha, 751024</div>
                            </div>
                         </div>
                      </RadioGroup>
                      
                      <div className="mt-4 flex items-center gap-2 text-blue-600 cursor-pointer hover:underline">
                         <Plus className="h-4 w-4" /> Add a new address
                      </div>

                      <Button onClick={() => setCurrentStep(STEPS.PAYMENT)} className="mt-6 bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                         Use this address
                      </Button>
                   </div>
                )}
             </div>

             {/* STEP 2: PAYMENT */}
             <div className={`border rounded-lg ${currentStep === STEPS.PAYMENT ? 'border-orange-500 shadow-sm' : 'border-slate-200'}`}>
                <div className="p-4 bg-slate-50 flex justify-between items-center cursor-pointer" onClick={() => setCurrentStep(STEPS.PAYMENT)}>
                   <h2 className={`font-bold ${currentStep === STEPS.PAYMENT ? 'text-orange-700' : 'text-slate-700'}`}>2. Payment method</h2>
                   {currentStep > STEPS.PAYMENT && (
                      <div className="text-sm font-bold">Visa ending in 4242</div>
                   )}
                </div>

                {currentStep === STEPS.PAYMENT && (
                   <div className="p-6 bg-white border-t space-y-4">
                      <RadioGroup value={payment} onValueChange={setPayment} className="space-y-4">
                         <div className="flex items-center gap-3">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center gap-2 font-bold">
                               <CreditCard className="h-4 w-4 text-slate-500" /> Credit or Debit Card
                            </Label>
                         </div>
                         
                         {payment === "card" && (
                            <div className="ml-7 grid gap-4 max-w-sm border p-4 rounded bg-slate-50">
                               <Input placeholder="Card Number" />
                               <div className="grid grid-cols-2 gap-4">
                                  <Input placeholder="MM/YY" />
                                  <Input placeholder="CVV" />
                               </div>
                            </div>
                         )}

                         <div className="flex items-center gap-3">
                            <RadioGroupItem value="upi" id="upi" />
                            <Label htmlFor="upi" className="font-bold">UPI Apps</Label>
                         </div>
                         
                         <div className="flex items-center gap-3">
                            <RadioGroupItem value="cod" id="cod" />
                            <Label htmlFor="cod" className="font-bold">Cash on Delivery / Pay on Delivery</Label>
                         </div>
                      </RadioGroup>

                      <Button onClick={() => setCurrentStep(STEPS.REVIEW)} className="mt-4 bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                         Use this payment method
                      </Button>
                   </div>
                )}
             </div>

             {/* STEP 3: REVIEW */}
             <div className={`border rounded-lg ${currentStep === STEPS.REVIEW ? 'border-orange-500 shadow-sm' : 'border-slate-200'}`}>
                <div className="p-4 bg-slate-50">
                   <h2 className={`font-bold ${currentStep === STEPS.REVIEW ? 'text-orange-700' : 'text-slate-700'}`}>3. Review items and delivery</h2>
                </div>

                {currentStep === STEPS.REVIEW && (
                   <div className="p-6 bg-white border-t">
                      <div className="border border-green-200 bg-green-50 p-3 rounded mb-4 text-sm text-green-800 font-medium">
                         Guaranteed Delivery: <span className="font-bold">Tomorrow by 8 PM</span>
                      </div>

                      <div className="flex gap-4 mb-6">
                         <div className="w-24 h-24 border p-2 bg-white flex items-center justify-center">
                            <img src="https://placehold.co/100x100/f1f5f9/475569?text=Item" className="max-h-full" />
                         </div>
                         <div>
                            <div className="font-bold">Sony WH-1000XM5 Wireless Noise Cancelling Headphones</div>
                            <div className="text-sm text-red-700 font-bold">₹24,990.00</div>
                            <div className="text-xs text-slate-500 mt-1">Sold by: Appario Retail Private Ltd</div>
                            <div className="flex gap-2 mt-2">
                               <Badge variant="outline">Qty: 1</Badge>
                               <span className="text-xs text-blue-600 cursor-pointer hover:underline self-center">Change</span>
                            </div>
                         </div>
                      </div>

                      <Link href="/checkout/success">
                         <Button className="w-full md:w-auto bg-yellow-400 text-slate-900 hover:bg-yellow-500 px-8">
                            Place your order
                         </Button>
                      </Link>
                      
                      <div className="text-xs text-slate-500 mt-2">
                         By placing your order, you agree to MarketHub's privacy notice and conditions of use.
                      </div>
                   </div>
                )}
             </div>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-4">
             <Card className="sticky top-24 border-slate-200 bg-white">
                <CardContent className="p-4 space-y-4">
                   <Link href="/checkout/success">
                      <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 mb-2">
                         Place your order
                      </Button>
                   </Link>
                   
                   <h3 className="font-bold text-lg border-b pb-2">Order Summary</h3>
                   
                   <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-slate-600">
                         <span>Items:</span>
                         <span>₹24,990.00</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                         <span>Delivery:</span>
                         <span>₹40.00</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                         <span>Promotion Applied:</span>
                         <span className="text-green-700">-₹40.00</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-bold text-red-700">
                         <span>Order Total:</span>
                         <span>₹24,990.00</span>
                      </div>
                   </div>

                   <div className="bg-slate-50 p-2 rounded text-xs text-slate-500 border">
                      <span className="font-bold text-blue-600">Pay on Delivery</span> available for this order.
                   </div>
                </CardContent>
             </Card>
          </div>

       </div>
    </div>
  )
}
