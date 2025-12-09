"use client"

import React from "react"
import Link from "next/link"
import { ChevronDown, LogOut, User, Heart, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserDropdownProps {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
}

const UserDropdown = ({ isLoggedIn, setIsLoggedIn }: UserDropdownProps) => {
  if (isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-9 w-9 border border-blue-200">
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Rahul Sharma</p>
              <p className="text-xs leading-none text-muted-foreground">rahul.dev@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Your Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Your Orders</DropdownMenuItem>
          <DropdownMenuItem>
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsLoggedIn(false)} 
            className="text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex flex-col items-start gap-0 h-auto py-1 px-2 hover:bg-slate-100">
          <span className="text-xs text-muted-foreground">Hello, sign in</span>
          <span className="text-sm font-bold flex items-center">
            Account <ChevronDown className="h-3 w-3 ml-1" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4" align="end">
        <div className="flex flex-col items-center gap-3 mb-4">
          <Button asChild className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold">
            <Link href="/login">Sign In</Link>
          </Button>
          <div className="text-xs text-center">
            New customer? <Link href="/register" className="text-blue-600 hover:underline">Start here.</Link>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="text-xs space-y-2">
            <h4 className="font-bold text-slate-900">Your Lists</h4>
            <Link href="#" className="block text-slate-600 hover:text-blue-600">Create a Wish List</Link>
            <Link href="#" className="block text-slate-600 hover:text-blue-600">Wish from any website</Link>
          </div>
          <div className="text-xs space-y-2 border-l pl-2">
            <h4 className="font-bold text-slate-900">Your Account</h4>
            <Link href="#" className="block text-slate-600 hover:text-blue-600">Your Orders</Link>
            <Link href="#" className="block text-slate-600 hover:text-blue-600">Your Addresses</Link>
            <Link href="/seller/login" className="block font-bold text-blue-600 hover:underline mt-2">
              Login as Seller
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown