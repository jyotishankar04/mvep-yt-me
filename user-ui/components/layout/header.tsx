"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Menu, MapPin, Store, ChevronDown, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SearchBar from "@/components/common/search-bar"
import CategoryStrip from "@/components/common/category-strip"
import UserDropdown from "@/components/common/user-dropdown"
import { CATEGORIES } from "@/components/data/constants"
import { usePathname } from "next/navigation"

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const path = usePathname()
  if(path.includes("auth")) return <></>

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      {/* Top Navbar */}
      <div className="container mx-auto px-4 h-16 flex items-center gap-4 lg:gap-6">
        
        {/* Mobile Menu */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 mr-2 flex-shrink-0">
          <div className="bg-blue-600 text-white p-1.5 rounded-md">
            <Store className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <span className="hidden md:block text-xl font-bold tracking-tight text-blue-600 italic">
            MarketHub
          </span>
        </Link>

        {/* Location Picker */}
        <div className="hidden lg:flex flex-col items-start text-xs leading-tight cursor-pointer hover:bg-slate-100 p-2 rounded whitespace-nowrap">
          <span className="text-muted-foreground ml-4">Deliver to</span>
          <div className="flex items-center font-bold">
            <MapPin className="h-3 w-3 mr-1" />
            <span>Bhubaneswar 751024</span>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar categories={CATEGORIES} />

        {/* Right Section Actions */}
        <div className="flex items-center gap-2 md:gap-6 flex-shrink-0">
          
          {/* Seller Link */}
          <Link href="/seller/register" className="hidden md:block text-xs font-medium hover:text-blue-600">
             Become a <br/> <span className="font-bold text-sm">Seller</span>
          </Link>

          {/* User Dropdown */}
          <UserDropdown isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

          {/* Cart */}
          <Link href="/cart" className="flex items-center gap-1 font-bold text-sm hover:text-blue-600 relative group">
            <div className="relative">
              <ShoppingCart className="h-7 w-7 text-slate-800 group-hover:text-blue-600" />
              <Badge className="absolute -top-1 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-yellow-400 text-slate-900 text-[10px] border-white">
                2
              </Badge>
            </div>
            <span className="hidden lg:inline mt-3 text-slate-800 group-hover:text-blue-600">Cart</span>
          </Link>
        </div>
      </div>

      {/* Categories Strip */}
      <CategoryStrip categories={CATEGORIES} />
    </header>
  )
}

export default Header