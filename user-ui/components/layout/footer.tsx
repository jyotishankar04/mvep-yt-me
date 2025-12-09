"use client"

import React from "react"
import Link from "next/link"
import { Store, Facebook, Twitter, Instagram } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { FOOTER_LINKS } from "@/components/data/constants"

const Footer = () => {
  const countries = ['Australia', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'Poland', 'Singapore', 'Spain', 'Turkey', 'UAE', 'United Kingdom', 'United States']

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Back to Top */}
      <div 
        className="bg-slate-800 hover:bg-slate-700 text-white text-center py-4 text-sm font-medium cursor-pointer transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm">
          <FooterColumn title="Get to Know Us" links={FOOTER_LINKS.about} />
          
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base">Connect with Us</h4>
            <ul className="space-y-2 text-xs md:text-sm text-slate-400">
              {FOOTER_LINKS.connect.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:underline hover:text-white flex items-center gap-2">
                    {link.icon === 'Facebook' && <Facebook className="h-4 w-4" />}
                    {link.icon === 'Twitter' && <Twitter className="h-4 w-4" />}
                    {link.icon === 'Instagram' && <Instagram className="h-4 w-4" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <FooterColumn title="Make Money with Us" links={FOOTER_LINKS.money} />
          <FooterColumn title="Let Us Help You" links={FOOTER_LINKS.help} />
        </div>

        <Separator className="bg-slate-800 my-8" />

        {/* Country Selector */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="bg-slate-700 p-1 rounded">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg italic tracking-tighter">MarketHub</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {countries.map(country => (
              <span key={country} className="hover:text-white cursor-pointer hover:underline">{country}</span>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
          <div className="flex justify-center gap-6 mb-2">
            <Link href="#" className="hover:underline hover:text-slate-400">Conditions of Use & Sale</Link>
            <Link href="#" className="hover:underline hover:text-slate-400">Privacy Notice</Link>
            <Link href="#" className="hover:underline hover:text-slate-400">Interest-Based Ads</Link>
          </div>
          <p>© 1996-2025, MarketHub, Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  )
}

const FooterColumn = ({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) => (
  <div className="space-y-4">
    <h4 className="font-bold text-white text-base">{title}</h4>
    <ul className="space-y-2 text-xs md:text-sm text-slate-400">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="hover:underline hover:text-white">{link.label}</Link>
        </li>
      ))}
    </ul>
  </div>
)

export default Footer