"use client"

import React from "react"
import { Menu, ChevronDown, Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CategoryStripProps {
  categories: Array<{ name: string; sub: string[] }>
}

const CategoryStrip = ({ categories }: CategoryStripProps) => {
  return (
    <div className="bg-slate-800 text-white text-sm font-medium overflow-x-auto hide-scrollbar">
      <div className="container mx-auto px-4 flex items-center h-10 gap-6 min-w-max">
        <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
          <Menu className="h-4 w-4" /> All
        </div>
        {categories.map((cat) => (
          <DropdownMenu key={cat.name}>
            <DropdownMenuTrigger className="hover:text-slate-200 focus:outline-none flex items-center gap-1">
              {cat.name} <ChevronDown className="h-3 w-3 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{cat.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {cat.sub.map(s => <DropdownMenuItem key={s} className="cursor-pointer">{s}</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-yellow-400">
          <Zap className="h-3 w-3" /> BIG SAVINGS DAYS ARE LIVE
        </div>
      </div>
    </div>
  )
}

export default CategoryStrip