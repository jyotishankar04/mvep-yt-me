import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterVerifyPage() {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-normal">Verify email address</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-sm text-slate-700 leading-relaxed">
    To verify your email, we have sent a One Time Password (OTP) to <span className="font-bold">name@example.com</span> <Link href="/register" className="text-blue-600 hover:underline">(Change)</Link>.
        </div>

        <div className="space-y-2">
          <Label htmlFor="otp" className="font-bold text-slate-700">Enter OTP</Label>
          <Input 
            id="otp" 
            placeholder="Enter 6-digit OTP" 
            className="focus-visible:ring-blue-600 tracking-widest" 
            maxLength={6}
          />
        </div>

        <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 border border-yellow-500 font-normal shadow-sm">
          Create your MarketHub account
        </Button>

        <div className="text-sm text-slate-600">
          <div className="mb-2">Resend OTP in 00:30</div>
          <Link href="#" className="text-blue-600 hover:underline hover:text-orange-700">
            Resend OTP
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
