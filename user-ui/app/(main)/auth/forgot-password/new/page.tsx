import { AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewPasswordPage() {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-normal">Create new password</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700">
          We&apos;ll ask for this password whenever you sign in.
        </p>

        <div className="space-y-2">
          <Label htmlFor="new-password" className="font-bold text-slate-700">New password</Label>
          <Input 
            id="new-password" 
            type="password" 
            className="focus-visible:ring-blue-600" 
          />
          <div className="flex items-start gap-1.5 mt-1 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Passwords must be at least 6 characters.</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="font-bold text-slate-700">Re-enter password</Label>
          <Input 
            id="confirm-password" 
            type="password" 
            className="focus-visible:ring-blue-600" 
          />
        </div>

        <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 border border-yellow-500 font-normal shadow-sm mt-2">
          Save changes and sign in
        </Button>
      </CardContent>
    </Card>
  )
}
