"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { ChevronDown, User, Heart, Bell, LogOut } from "lucide-react"
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
import { Spinner } from "../ui/spinner"

interface UserDropdownProps {
  isLoggedIn: boolean
  logout: () => void,
  isLogoutSuccess: boolean,
  isLoggingOut: boolean,
  isLogoutError: boolean,
  user?: {
    name: string,
    email: string,
    role: "user" | "admin" | "seller",
    id: string,
    avatar?: string
  },
  isLoading: boolean,
  isError: boolean,
  refetch: () => void
}




const UserDropdown = ({ isLoggedIn, logout, isLogoutSuccess, refetch, isLoggingOut, user, isLoading }: UserDropdownProps) => {
  useEffect(() => {
    if (isLogoutSuccess) {
      refetch()
    }
  }, [isLogoutSuccess, refetch])

  if (isLoading) return <div>
    <Spinner />
  </div>
  if (isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-9 w-9 border border-blue-200">
              <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
              <AvatarFallback>{user?.name?.charAt(0) || ""}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
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
            onClick={async () => {
              await logout()
            }}
            disabled={isLoggingOut}
            className="text-red-600"
          >
            {
              isLoggingOut ? <><Spinner /> <> <LogOut className="mr-2 h-4 w-4" />  Logout </> </> : <><LogOut className="mr-2 h-4 w-4" /> Logout</>
            }
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
          <Button asChild className="w-full      hover:  font-bold">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <div className="text-xs text-center">
            New customer? <Link href="/auth/register" className="text-blue-600 hover:underline">Start here.</Link>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="text-xs space-y-2">
            <h4 className="font-bold   ">Your Lists</h4>
            <Link href="#" className="block text-slate-600 hover:text-blue-600">Create a Wish List</Link>
            <Link href="#" className="block text-slate-600 hover:text-blue-600">Wish from any website</Link>
          </div>
          <div className="text-xs space-y-2 border-l pl-2">
            <h4 className="font-bold   ">Your Account</h4>
            <Link href="#" className="block text-slate-600 hover:text-blue-600">Your Orders</Link>
            <Link href="#" className="block text-slate-600 hover:text-blue-600">Your Addresses</Link>
            <Link href="/auth/seller/login" className="block font-bold text-blue-600 hover:underline mt-2">
              Login as Seller
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown