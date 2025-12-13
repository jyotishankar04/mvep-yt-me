"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRegisterOtpVerify } from "@/utils/query"

export default function RegisterVerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [canResend, setCanResend] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)

  const email = typeof window !== "undefined" 
    ? localStorage.getItem("register_email") 
    : ""
  const maskedEmail = email ? 
    `...${email.substring(email.indexOf('@') - 2)}` : 
    "your email"

  // Timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(prev => !prev)
    }
  }, [resendTimer])

  const { mutate: verifyOtp, isLoading: isVerifying } = useRegisterOtpVerify()

  const handleVerify = useCallback(() => {
    if (otp.length !== 6) return
    
    const token = localStorage.getItem("register_token")
    if (!token) return

    verifyOtp({
      otp: otp,
      token: token
    }, {
      onSuccess: () => {
        localStorage.removeItem("register_token")
        localStorage.removeItem("register_email")
        router.push("/auth/login")
      }
    })
  }
  , [otp, verifyOtp, router])

  const handleResend = () => {
    const token = localStorage.getItem("register_token")
    const email = localStorage.getItem("register_email")
    
    fetch("http://localhost:8000/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    })
    
    setCanResend(false)
    setResendTimer(60)
  }

  // Auto-submit on complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify()
    }
  }, [otp, handleVerify])

  return (
    <Card className="shadow-sm border-slate-200 max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-normal">Verification required</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-slate-50 border-slate-200">
          <Info className="h-4 w-4 text-slate-600" />
          <AlertDescription className="text-sm text-slate-700 ml-2">
            We have sent an OTP to the email address ending in {maskedEmail}.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label className="font-bold text-slate-700">Enter OTP</Label>
          <div className="flex justify-center">
            <InputOTP 
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button 
          className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 border border-yellow-500 font-normal shadow-sm"
          onClick={handleVerify}
          disabled={isVerifying || otp.length !== 6}
        >
          {isVerifying ? "Verifying..." : "Continue"}
        </Button>
        
        <div className="text-center">
          <button 
            className="text-xs text-blue-600 hover:underline hover:text-orange-700 disabled:text-slate-400"
            onClick={handleResend}
            disabled={!canResend || isVerifying}
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}