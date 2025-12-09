"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import {IconBrandGoogleFilled} from "@tabler/icons-react"
import { useForm } from "react-hook-form"
import { Separator } from "@/components/ui/separator"
import { FieldSeparator } from "@/components/ui/field"

type formData = {
  email: string,
  password: string
}

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }

  } = useForm<formData>()




  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-normal">Sign in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
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
          {
            errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>
          }
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
            <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
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
          {
            errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>
          }
        </div>

        <Button className="w-full">
          Sign in
        </Button>


        <FieldSeparator className="my-2"> OR </FieldSeparator>

        <Link href="/auth/google">
          <Button
            variant="secondary"
            type="button"
            className="w-full cursor-pointer"
          >
            Sign in with Google <IconBrandGoogleFilled />
          </Button>
        </Link>


        <div className="pt-4 text-center text-sm">
          New to MarketHub?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Create account
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
