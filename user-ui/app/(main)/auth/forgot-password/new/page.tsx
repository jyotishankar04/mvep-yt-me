"use client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResetPassword } from "@/utils/query"

type FormData = {
  newPassword: string
  confirmPassword: string
}

export default function NewPasswordPage() {
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  })

  const { mutate: resetPassword, isLoading: isResetting } = useResetPassword()

  const onSubmit = (data: FormData) => {
    if (data.newPassword !== data.confirmPassword) {
      // Validation will be handled by the form
      return
    }

    const token = localStorage.getItem("forgot_password_token")
    if (!token) {
      router.push("/auth/forgot-password")
      return
    }

    resetPassword({
      newPassword: data.newPassword,
      token: token
    }, {
      onSuccess: () => {
        localStorage.removeItem("forgot_password_token")
        localStorage.removeItem("forgot_password_email")
        router.push("/auth/login")
      }
    })
  }

  return (
    <Card className="shadow-sm border-slate-200 max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-normal">Create new password</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700">
          We&apos;ll ask for this password whenever you sign in.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="font-bold text-slate-700">New password</Label>
            <Input 
              id="new-password" 
              type="password" 
              className="focus-visible:ring-blue-600"
              disabled={isResetting}
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.newPassword && (
              <span className="text-xs text-red-600">{errors.newPassword.message}</span>
            )}
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
              disabled={isResetting}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value, formValues) => 
                  value === formValues.newPassword || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && (
              <span className="text-xs text-red-600">{errors.confirmPassword.message}</span>
            )}
          </div>

          <Button 
            className="w-full"
            type="submit"
            disabled={isResetting}
          >
            {isResetting ? "Updating..." : "Save changes and sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}