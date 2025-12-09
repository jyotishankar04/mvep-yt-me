import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10">
      
      {/* Shared Header / Logo */}
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-md">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-blue-600 italic">
            MarketHub
          </span>
        </Link>
      </div>

      {/* The Page Content (Login or Register form goes here) */}
      <div className="w-full max-w-[400px]">
        {children}
      </div>

      {/* Shared Footer */}
      <footer className="mt-8 text-center space-y-4 w-full max-w-[400px]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="flex justify-center gap-6 text-xs text-blue-700">
          <Link href="/conditions" className="hover:underline hover:text-orange-700">
            Conditions of Use
          </Link>
          <Link href="/privacy" className="hover:underline hover:text-orange-700">
            Privacy Notice
          </Link>
          <Link href="/help" className="hover:underline hover:text-orange-700">
            Help
          </Link>
        </div>
        <p className="text-xs text-slate-500">© 1996-2024, MarketHub, Inc.</p>
      </footer>
    </div>
  )
}

