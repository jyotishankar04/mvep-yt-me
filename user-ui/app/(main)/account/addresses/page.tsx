"use client"

import React from "react"
import { Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const ADDRESSES = [
  { id: 1, name: "Rahul Sharma", addr: "Plot No 123, Khandagiri", city: "Bhubaneswar", state: "Odisha", zip: "751030", country: "India", phone: "9876543210", default: true },
  { id: 2, name: "Rahul (Work)", addr: "DLF Cyber City, Patia", city: "Bhubaneswar", state: "Odisha", zip: "751024", country: "India", phone: "9876543210", default: false },
]

export default function AddressesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen bg-white">
       <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
             <span className="hover:underline cursor-pointer">Your Account</span> &rsaquo; <span className="font-bold text-orange-700">Your Addresses</span>
          </div>
          <h1 className="text-2xl font-bold">Your Addresses</h1>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Card */}
          <Card className="border-2 border-dashed border-slate-300 shadow-none flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-50 transition-colors min-h-[250px]">
             <Plus className="h-10 w-10 text-slate-400 mb-2" />
             <h3 className="font-bold text-lg text-slate-700">Add Address</h3>
          </Card>

          {/* Address Cards */}
          {ADDRESSES.map((addr) => (
             <Card key={addr.id} className={`relative flex flex-col justify-between ${addr.default ? 'border-orange-500 ring-1 ring-orange-500' : ''}`}>
                <CardContent className="p-6">
                   {addr.default && (
                      <div className="text-xs font-bold text-slate-500 border-b pb-2 mb-3">Default: <span className="text-orange-600">Primary</span></div>
                   )}
                   <div className="font-bold text-lg mb-1">{addr.name}</div>
                   <div className="text-sm text-slate-600 space-y-1">
                      <p>{addr.addr}</p>
                      <p>{addr.city}, {addr.state} {addr.zip}</p>
                      <p>{addr.country}</p>
                      <p className="mt-2">Phone number: {addr.phone}</p>
                   </div>
                </CardContent>
                <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-between">
                   <div className="flex gap-4 text-sm text-blue-600 font-medium">
                      <span className="cursor-pointer hover:underline">Edit</span>
                      <span className="cursor-pointer hover:underline">Remove</span>
                   </div>
                   {!addr.default && (
                      <Button variant="ghost" size="sm" className="text-xs h-7">Set as Default</Button>
                   )}
                </div>
             </Card>
          ))}
       </div>
    </div>
  )
}
