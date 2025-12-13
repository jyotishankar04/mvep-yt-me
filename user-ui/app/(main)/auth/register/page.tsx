"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"

// Shadcn Imports
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import GoogleAuthButton from "@/components/common/google-auth-button"
import { useForm } from "react-hook-form"
import { useUserRegister } from "@/utils/query"
import { Spinner } from "@/components/ui/spinner"

type FormData = {
  name: string
  email: string
  password: string
  password_confirm: string
}

export default function RegisterPage() {
  const router = useRouter()
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>()

  const { 
    mutateAsync: registerUser, 
    isLoading: isRegistering 
  } = useUserRegister()

  const onSignUp = async (data: FormData) => {
    if (data.password !== data.password_confirm) {
      return // Validation will handle this
    }

    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      })

      if (response?.success && response.data?.redirect_token) {
        // Store token and email for OTP verification page
        localStorage.setItem("register_token", response.data.redirect_token)
        localStorage.setItem("register_email", data.email)
        
        // Redirect to verification page
        router.push("/auth/register/verify?auth_token=" + response.data.redirect_token)
      }
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

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
            type="text"
            {...register("name", { required: "Name is required" })}
            placeholder="Jhon doe"
            disabled={isRegistering}
          />
          {errors.name && (
            <span className="text-xs text-red-600">{errors.name.message}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            placeholder="jhon@example.com"
            disabled={isRegistering}
          />
          {errors.email && (
            <span className="text-xs text-red-600">{errors.email.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            disabled={isRegistering}
          />
          {errors.password && (
            <span className="text-xs text-red-600">{errors.password.message}</span>
          )}
          <div className="flex items-start gap-1.5 mt-1 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Passwords must be at least 6 characters.</span>
          </div>
        </div>

        {/* Re-enter Password */}
        <div className="space-y-2">
          <Label htmlFor="password-confirm" className="font-bold text-slate-700">
            Re-enter password
          </Label>
          <Input
            id="password-confirm"
            type="password"
            {...register("password_confirm", { 
              required: "Please confirm your password",
              validate: (value, { password }) => 
                value === password || "Passwords do not match"
            })}
            disabled={isRegistering}
          />
          {errors.password_confirm && (
            <span className="text-xs text-red-600">{errors.password_confirm.message}</span>
          )}
        </div>

        {/* Action Button */}
        <Button 
          className="w-full py-2"
          onClick={handleSubmit(onSignUp)}
          disabled={isRegistering}
        >
        
          {isRegistering ? <><Spinner className="mr-2" /> Verifying</> : "Verify email"}
        </Button>

        <GoogleAuthButton />

        {/* Legal Text */}
        <div className="text-xs text-slate-600 leading-relaxed">
          By creating an account, you agree to MarketHub&apos;s{" "}
          <Link href="#" className="text-blue-600 hover:underline">Conditions of Use</Link>{" "}
          and <Link href="#" className="text-blue-600 hover:underline">Privacy Notice</Link>.
        </div>

        <Separator className="my-2" />

        {/* Footer Links */}
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-slate-700">Already have an account?</span>
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:underline hover:text-orange-700 font-medium"
            >
              Sign in
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-700">Buying for work?</span>
            <Link 
              href="/business/register" 
              className="text-blue-600 hover:underline hover:text-orange-700"
            >
              Create a free Business Account
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}