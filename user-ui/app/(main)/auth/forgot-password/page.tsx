"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useForgotPassword } from "@/utils/query"

type FormData = {
  email: string
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const { 
    mutate: forgotPassword, 
    isLoading, 
    isError,
    error,
    isSuccess 
  } = useForgotPassword()

  const onSubmit = (data: FormData) => {
    forgotPassword({
      email: data.email
    }, {
      onSuccess: (response) => {
        if (response?.success && response.data?.redirect_token) {
          localStorage.setItem("forgot_password_token", response.data.redirect_token)
          localStorage.setItem("forgot_password_email", data.email)
          router.push("/auth/forgot-password/verify?auth_token=" + response.data.redirect_token)
        }
      }
    })
  }

  return (
    <Card className="shadow-sm border-slate-200 max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-normal">Password assistance</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Success Alert */}
        {isSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              OTP sent to your email! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.response?.data.message || "Failed to send OTP"}
            </AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-slate-700 leading-relaxed">
          Enter the email address associated with your MarketHub account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
            <Input 
              id="email" 
              type="email"
              disabled={isLoading || isSuccess}
              className="focus-visible:ring-blue-600"
              placeholder="jhon@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <span className="text-xs text-red-600">{errors.email.message}</span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isSuccess}
          >
            {isLoading ? "Sending OTP..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}