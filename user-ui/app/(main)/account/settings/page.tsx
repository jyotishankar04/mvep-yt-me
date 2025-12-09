"use client"

import React, { useState } from "react"
import { 
  User, Lock, Bell, CreditCard, MapPin, Globe, Shield, 
  Smartphone, LogOut, ChevronRight, Mail, Eye, EyeOff 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  // Sidebar Navigation Items
  const NAV_ITEMS = [
    { id: "profile", label: "Public Profile", icon: User },
    { id: "account", label: "Account Info", icon: Shield },
    { id: "security", label: "Login & Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payments & Wallet", icon: CreditCard },
    { id: "language", label: "Language & Region", icon: Globe },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      
      {/* Page Header */}
      <div className="bg-white border-b py-6 mb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account preferences and settings.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ================= SIDEBAR ================= */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap text-left w-full
                    ${activeTab === item.id 
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" 
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                    }`}
                >
                  <item.icon className={`h-4 w-4 ${activeTab === item.id ? "text-blue-600" : "text-slate-400"}`} />
                  {item.label}
                </button>
              ))}
              
              <Separator className="my-2 hidden lg:block" />
              
              <button className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left mt-auto">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* ================= CONTENT AREA ================= */}
          <main className="flex-1 space-y-6">
            
            {/* 1. PUBLIC PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your photo and personal details visible to others.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24 border-4 border-slate-50">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">Change Avatar</Button>
                        <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" defaultValue="Rahul" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" defaultValue="Sharma" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" placeholder="Tell us a little about yourself" />
                      <p className="text-xs text-slate-500">Brief description for your profile.</p>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 2. LOGIN & SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <Card>
                  <CardHeader>
                    <CardTitle>Login & Security</CardTitle>
                    <CardDescription>Manage your password and 2-step verification.</CardDescription>
                  </CardHeader>
                  <CardContent className="divide-y">
                    
                    {/* Password Row */}
                    <div className="flex items-center justify-between py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Password</p>
                        <p className="text-xs text-slate-500">Last updated 3 months ago</p>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>

                    {/* 2FA Row */}
                    <div className="flex items-center justify-between py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">2-Step Verification</p>
                        <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 bg-blue-50">Turn on</Button>
                    </div>

                    {/* Recovery Email */}
                    <div className="flex items-center justify-between py-4">
                       <div className="space-y-1">
                          <p className="font-medium text-sm">Recovery Email</p>
                          <p className="text-xs text-slate-500">r*****@gmail.com</p>
                       </div>
                       <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Manage devices where you're currently logged in.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-md border"><Smartphone className="h-5 w-5 text-slate-500"/></div>
                         <div>
                            <p className="text-sm font-bold">Chrome on Windows</p>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Active now
                            </p>
                         </div>
                      </div>
                      <Button variant="ghost" size="sm" disabled>This Device</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 rounded-md border"><Smartphone className="h-5 w-5 text-slate-500"/></div>
                         <div>
                            <p className="text-sm font-bold">iPhone 13 Pro</p>
                            <p className="text-xs text-slate-500">Last active 2 days ago • Mumbai, India</p>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100">Log out</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 3. NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <Card>
                     <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>Choose how you receive updates.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        
                        <div className="space-y-4">
                           <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <Mail className="h-4 w-4" /> Email Notifications
                           </h3>
                           <div className="flex items-center justify-between">
                              <Label htmlFor="order-updates" className="flex-1 text-sm font-normal text-slate-600 cursor-pointer">
                                 Order status updates
                              </Label>
                              <Switch id="order-updates" defaultChecked />
                           </div>
                           <div className="flex items-center justify-between">
                              <Label htmlFor="promos" className="flex-1 text-sm font-normal text-slate-600 cursor-pointer">
                                 Promotions and deals
                              </Label>
                              <Switch id="promos" />
                           </div>
                           <div className="flex items-center justify-between">
                              <Label htmlFor="security-alerts" className="flex-1 text-sm font-normal text-slate-600 cursor-pointer">
                                 Security alerts
                              </Label>
                              <Switch id="security-alerts" defaultChecked disabled />
                           </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                           <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <Smartphone className="h-4 w-4" /> Push Notifications
                           </h3>
                           <div className="flex items-center justify-between">
                              <Label htmlFor="push-delivery" className="flex-1 text-sm font-normal text-slate-600 cursor-pointer">
                                 Delivery updates
                              </Label>
                              <Switch id="push-delivery" defaultChecked />
                           </div>
                           <div className="flex items-center justify-between">
                              <Label htmlFor="push-chat" className="flex-1 text-sm font-normal text-slate-600 cursor-pointer">
                                 Seller messages
                              </Label>
                              <Switch id="push-chat" defaultChecked />
                           </div>
                        </div>

                     </CardContent>
                  </Card>
               </div>
            )}

            {/* 4. PAYMENTS TAB */}
            {activeTab === "payments" && (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <Card>
                     <CardHeader>
                        <CardTitle>Saved Cards</CardTitle>
                        <CardDescription>Securely manage your payment methods.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="p-4 border rounded-lg flex items-center justify-between bg-slate-50">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-8 bg-white border rounded flex items-center justify-center">
                                 <span className="font-bold text-xs italic text-blue-800">VISA</span>
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">Visa ending in 4242</p>
                                 <p className="text-xs text-slate-500">Expires 12/28</p>
                              </div>
                           </div>
                           <Button variant="ghost" size="sm">Remove</Button>
                        </div>

                        <Button variant="outline" className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-slate-900 hover:border-slate-400">
                           + Add New Card
                        </Button>
                     </CardContent>
                  </Card>
               </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}
