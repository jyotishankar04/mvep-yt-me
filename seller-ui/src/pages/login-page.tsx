"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Link, useLocation } from "react-router-dom"

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useLocation()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  // const { mutate: loginUser, isLoading: isLoggingIn, isError: isLoggingInError, error: loginError } = useLoginUser()

  // useEffect(() => {
  //   if (isLoggingInError && loginError instanceof AxiosError) {
  //     toast.error(loginError.response?.data.message, {
  //       icon: "🚫",
  //     })
  //   }
  // }, [isLoggingInError, loginError])

  // const onLogin = (data: FormData) => {
  //   loginUser(data, {
  //     onSuccess: () => {
  //       router.push("/")
  //     }
  //   })
  // }

  return (
    <Card className="shadow-sm  max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-normal">Sign in</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form  className="space-y-4">
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
            // disabled={isLoggingIn}
          >
            Sign in
            {/* {isLoggingIn ? "Signing in..." : "Sign in"} */}
          </Button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t d" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="">Or continue with</span>
          </div>
        </div>

        {/* <GoogleAuthButton disabled={isLoggingIn} /> */}

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