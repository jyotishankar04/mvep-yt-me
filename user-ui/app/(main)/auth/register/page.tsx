import Link from "next/link"
import { Info } from "lucide-react"

// Shadcn Imports
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function RegisterPage() {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-normal">Create Account</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="font-bold text-slate-700">Your name</Label>
          <Input 
            id="name" 
            placeholder="Jhon doe" 
          />
        </div>

        {/* Email Field (Primary) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="jhon@example.com" 
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="At least 6 characters" 
          />
          <div className="flex items-start gap-1.5 mt-1 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Passwords must be at least 6 characters.</span>
          </div>
        </div>

        {/* Re-enter Password (Standard for Email flows) */}
        <div className="space-y-2">
          <Label htmlFor="password-confirm" className="font-bold text-slate-700">Re-enter password</Label>
          <Input 
            id="password-confirm" 
            type="password" 
            className="focus-visible:ring-blue-600" 
          />
        </div>

        {/* Action Button */}
        <Button className="w-full py-2">
          Verify email
        </Button>

        {/* Legal Text */}
        <div className="text-xs text-slate-600 leading-relaxed">
          By creating an account, you agree to MarketHub&apos;s <Link href="#" className="text-blue-600 hover:underline">Conditions of Use</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Notice</Link>.
        </div>

        <Separator className="my-2" />

        {/* Footer Links */}
        <div className="text-sm space-y-2">
           <div className="flex items-center gap-1">
             <span className="text-slate-700">Already have an account?</span>
             <Link href="/auth/login" className="text-blue-600 hover:underline hover:text-orange-700 font-medium">
               Sign in
             </Link>
           </div>
           
           <div className="flex items-center gap-1">
             <span className="text-slate-700">Buying for work?</span>
             <Link href="/business/register" className="text-blue-600 hover:underline hover:text-orange-700">
               Create a free Business Account
             </Link>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}
