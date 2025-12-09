"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
    const router = useRouter()    
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-normal">Password assistance</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          Enter the email address associated with your MarketHub account.
        </p>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
          <Input 
            id="email" 
            type="email" 
            className="focus-visible:ring-blue-600" 
          />
        </div>

        <Button
        onClick={()=>{
          router.push("/auth/forgot-password/verify")
        }}
        className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 border border-yellow-500 font-normal shadow-sm">
          Continue
        </Button>
      </CardContent>
    </Card>
  )
}
