"use client"

import React from "react"
import Link from "next/link"
import { 
  Package, Heart, MapPin, Settings, CreditCard, 
  Lock, Headset, LogOut, ChevronRight, User, Bell 
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const DASHBOARD_LINKS = [
  { 
    title: "Your Orders", 
    desc: "Track, return, or buy things again", 
    icon: Package, 
    href: "/account/orders",
    color: "bg-orange-100 text-orange-600"
  },
  { 
    title: "Login & Security", 
    desc: "Edit name, email, and mobile number", 
    icon: Lock, 
    href: "/account/security",
    color: "bg-blue-100 text-blue-600"
  },
  { 
    title: "Your Addresses", 
    desc: "Edit addresses for orders and gifts", 
    icon: MapPin, 
    href: "/account/addresses",
    color: "bg-green-100 text-green-600"
  },
  { 
    title: "Payment Options", 
    desc: "Edit or add payment methods", 
    icon: CreditCard, 
    href: "/account/payments",
    color: "bg-purple-100 text-purple-600"
  },
  { 
    title: "Your Wish List", 
    desc: "View, modify, and share your lists", 
    icon: Heart, 
    href: "/account/wishlist",
    color: "bg-pink-100 text-pink-600"
  },
  { 
    title: "Contact Us", 
    desc: "Customer Service and Feedback", 
    icon: Headset, 
    href: "/help",
    color: "bg-slate-100 text-slate-600"
  }
]

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-white pb-10">
       <div className="bg-slate-50 border-b py-8 mb-8">
          <div className="container mx-auto px-4 flex items-center gap-4">
             <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>RS</AvatarFallback>
             </Avatar>
             <div>
                <h1 className="text-2xl font-bold   ">Hello, Rahul Sharma</h1>
                <p className="text-slate-500">MarketHub Customer since 2021</p>
             </div>
          </div>
       </div>

       <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-xl font-bold mb-6">Your Account</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
             {DASHBOARD_LINKS.map((link) => (
                <Link href={link.href} key={link.title} className="group">
                   <Card className="h-full border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-6 flex items-start gap-4">
                         <div className={`p-3 rounded-lg ${link.color} group-hover:scale-110 transition-transform`}>
                            <link.icon className="h-6 w-6" />
                         </div>
                         <div>
                            <h3 className="font-bold text-lg    mb-1">{link.title}</h3>
                            <p className="text-sm text-slate-500 leading-tight">{link.desc}</p>
                         </div>
                      </CardContent>
                   </Card>
                </Link>
             ))}
          </div>

          <Separator className="my-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Quick Actions List */}
             <div>
                <h3 className="font-bold text-lg mb-4">More options</h3>
                <div className="grid grid-cols-1 gap-2">
                   {["Digital Services and Device Support", "Manage Prime Membership", "Review Your Purchases", "Archived Orders"].map((item) => (
                      <Link href="#" key={item} className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors">
                         <span className="text-sm font-medium">{item}</span>
                         <ChevronRight className="h-4 w-4 text-slate-400" />
                      </Link>
                   ))}
                </div>
             </div>
             
             {/* Notification / Promo Area */}
             <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader>
                   <CardTitle className="text-blue-900 flex items-center gap-2">
                      <Bell className="h-5 w-5" /> Account Alerts
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="bg-white p-3 rounded border border-blue-100 shadow-sm text-sm">
                      <span className="font-bold text-orange-600 block mb-1">Arriving Today</span>
                      Your package containing "Sony WH-1000XM5" is out for delivery.
                   </div>
                   <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50">View all alerts</Button>
                </CardContent>
             </Card>
          </div>
       </div>
    </div>
  )
}
