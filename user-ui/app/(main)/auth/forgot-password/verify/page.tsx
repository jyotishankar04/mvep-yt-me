import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotVerifyPage() {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-normal">Verification required</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-slate-50 border-slate-200 mb-2">
           <Info className="h-4 w-4 text-slate-600" />
           <AlertDescription className="text-xs text-slate-700 ml-2">
             To continue, complete this verification step. We have sent an OTP to the email address ending in ...@gmail.com.
           </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="otp" className="font-bold text-slate-700">Enter OTP</Label>
          <Input 
            id="otp" 
            className="focus-visible:ring-blue-600" 
            maxLength={6}
          />
        </div>

        <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 border border-yellow-500 font-normal shadow-sm">
          Continue
        </Button>
        
        <div className="text-center">
            <button className="text-xs text-blue-600 hover:underline hover:text-orange-700">
                Resend OTP
            </button>
        </div>
      </CardContent>
    </Card>
  )
}
