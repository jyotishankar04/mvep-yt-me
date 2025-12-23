"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSellerLogin } from "@/utils/query"
import { AxiosError } from "axios"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const { mutateAsync: loginUser, isPending: isLoggingIn, isError: isLoggingInError, error: loginError, isSuccess: isLoginSuccess } = useSellerLogin()

  useEffect(() => {
    if (isLoggingInError && loginError instanceof AxiosError) {
      toast.error(loginError.response?.data.message, {
        icon: "🚫",
      })
    }
  }, [isLoggingInError, loginError])

  const onLogin = handleSubmit(async (data: FormData) => {
    loginUser(data,{
      onSuccess: (data) => {
          if(data && data.data && data.data.status){
              if(data.data.status === "SETUP"){
                  router("/auth/register?step=2");
              }else if(data.data.status === "CONNECT"){
                  router("/auth/register?step=3");
              }else if(data.data.status === "COMPLETED"){
                  router("/app"); 
              }else{
                  router("/auth/register?step=1");
              }
          }
      }
    })
  })

  return (
    <Card className="shadow-sm  max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-normal">Sign in</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={onLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold ">Email</Label>
            <Input
              id="email"
              placeholder="jhon@example.com"
              type="email"
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

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="font-bold">Password</Label>
              <Link
                to="/auth/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              placeholder="********"
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && (
              <span className="text-xs text-red-600">{errors.password.message}</span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="pt-4 text-center text-sm">
          New to MarketHub Sellers?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Create account
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}