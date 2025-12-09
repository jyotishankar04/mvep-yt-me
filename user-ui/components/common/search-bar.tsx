"use client"

import React from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchBarProps {
  categories: Array<{ name: string; sub: string[] }>
}

const SearchBar = ({ categories }: SearchBarProps) => {
  return (
    <div className="flex-1 max-w-2xl flex items-center relative">
      <div className="flex w-full h-10 rounded-md border-2 border-blue-600 overflow-hidden focus-within:ring-2 focus-within:ring-blue-200 transition-all bg-white">
        <div className="hidden sm:block border-r border-slate-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-full rounded-none px-3 text-xs bg-slate-50 text-slate-600 hover:bg-slate-100 font-normal">
                All <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-80 overflow-y-auto">
              {categories.map((c) => (
                <DropdownMenuItem key={c.name}>{c.name}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Input 
          className="flex-1 border-0 rounded-none focus-visible:ring-0 shadow-none px-4 text-sm"
          placeholder="Search products, brands and more..."
        />
        <Button className="h-full rounded-none bg-blue-100 text-blue-600 hover:bg-blue-200 px-4">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default SearchBar