"use client"
import { useState } from "react"
import { Info, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"

// Shadcn Imports
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useRegisterSeller, useSellerRegisterVerify } from "@/utils/query"

// ==================== ZOD SCHEMAS ====================

const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    country: z.string().min(1, "Country is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirm: z.string(),
    otp: z.string().optional()
}).refine((data: { password: string; password_confirm: string }) => data.password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"]
})

type AccountFormData = z.infer<typeof accountSchema>

const sellerSchema = z.object({
    businessName: z.string().min(1, "Business name is required"),
    bio: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    openingHours: z.string().default("Mon-Fri 9am-5pm"),
    website: z.string().url("Invalid URL").or(z.literal("")).optional(),
    category: z.string().min(1, "Category is required")
})

type SellerFormData = z.infer<typeof sellerSchema>

// ==================== STEP 1: CREATE ACCOUNT ====================
interface Step1Props {
  onComplete: (data: AccountFormData) => void
  onBack?: () => void
}
const Step1: React.FC<Step1Props> = ({ onComplete, onBack }) => {
  const [otpSent, setOtpSent] = useState(false)
  const [redirectToken, setRedirectToken] = useState<string | null>(null)

  const {
    mutateAsync: sendRegisterOtp,
    isLoading: isSendingOtp,
  } = useRegisterSeller()

  const {
    mutateAsync: verifyRegisterOtp,
    isLoading: isVerifyingOtp,
  } = useSellerRegisterVerify()

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      country: "",
    },
  })

  const COUNTRIES = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "IN", name: "India" },
  ]

  // 1️⃣ SEND OTP
  const handleSendOtp = async (data: AccountFormData) => {
    const res = await sendRegisterOtp({
      name: data.name,
      email: data.email,
      phone_number: data.phone,
      country: data.country,
      password: data.password,
    })

    setRedirectToken(res.data.redirect_token)
    setOtpSent(true)
  }

  // 2️⃣ VERIFY OTP
  const handleVerifyOtp = async (data: AccountFormData) => {
    if (!redirectToken) return

    await verifyRegisterOtp({
      otp: data.otp!,
      token: redirectToken,
    })

    onComplete(data)
  }

  const onSubmit = async (data: AccountFormData) => {
    if (!otpSent) {
      await handleSendOtp(data)
    } else {
      await handleVerifyOtp(data)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label className="font-bold">Full Name *</Label>
        <Input placeholder="Jhon Doe" {...register("name")} />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label className="font-bold">Email *</Label>
        <Input placeholder="g9g7w@example.com" type="email" {...register("email")} />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      {/* Country + Phone */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bold">Country *</Label>
          <Select
            onValueChange={async (value) => {
              setValue("country", value)
              await trigger("country")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-xs text-red-600">{errors.country.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Phone *</Label>
          <Input placeholder="+1 234 567 8901" {...register("phone")} />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label className="font-bold">Password *</Label>
        <Input placeholder="Password" type="password" {...register("password")} />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label className="font-bold">Confirm Password *</Label>
        <Input placeholder="Confirm Password" type="password" {...register("password_confirm")} />
        {errors.password_confirm && (
          <p className="text-xs text-red-600">{errors.password_confirm.message}</p>
        )}
      </div>

      {/* OTP */}
      {otpSent && (
        <div className="space-y-2 animate-in fade-in-50">
          <Label className="font-bold">Verification Code *</Label>

          <div className="flex gap-2">
            <Input
              {...register("otp", { required: "OTP is required" })}
              placeholder="Enter OTP"
            />

            <Button
              type="button"
              variant="outline"
              disabled={isSendingOtp}
              onClick={() => handleSendOtp(getValues())}
            >
              Resend
            </Button>
          </div>

          {errors.otp && <p className="text-xs text-red-600">{errors.otp.message}</p>}
        </div>
      )}

      <Separator />

      <div className="flex justify-between">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}

        <Button type="submit" disabled={isSendingOtp || isVerifyingOtp}>
          {otpSent ? "Verify & Continue" : "Send Verification Code"}
        </Button>
      </div>
    </form>
  )
}

// ==================== STEP 2: SETUP SELLER ====================

interface Step2Props {
    onComplete: (data: SellerFormData) => void
    onBack: () => void
}

const Step2: React.FC<Step2Props> = ({ onComplete, onBack }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<SellerFormData>({
        defaultValues: {
            openingHours: "Mon-Fri 9am-5pm",
            businessName: "",
            bio: "",
            category: "",
            address: "",
            website: "",
        },

    })

    const CATEGORIES = [
        "Electronics",
        "Fashion & Clothing",
        "Home & Garden",
        "Beauty & Personal Care",
        "Sports & Outdoors",
        "Books & Media",
        "Food & Grocery",
        "Health & Wellness",
        "Automotive",
        "Toys & Games",
    ]

    return (
        <form onSubmit={handleSubmit(onComplete)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="businessName" className="font-bold">Business Name *</Label>
                <Input
                    id="businessName"
                    type="text"
                    {...register("businessName")}
                    placeholder="Your Business Inc."
                />
                {errors.businessName && (
                    <span className="text-xs text-red-600">{errors.businessName.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category" className="font-bold">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category && (
                    <span className="text-xs text-red-600">{errors.category.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio" className="font-bold">Business Bio</Label>
                <Textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Tell us about your business..."
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="font-bold">Business Address *</Label>
                <Textarea
                    id="address"
                    {...register("address")}
                    placeholder="123 Business St, City, State, ZIP"
                    rows={2}
                />
                {errors.address && (
                    <span className="text-xs text-red-600">{errors.address.message}</span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="openingHours" className="font-bold">Opening Hours</Label>
                    <Input
                        id="openingHours"
                        type="text"
                        {...register("openingHours")}
                        placeholder="Mon-Fri 9am-5pm"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website" className="font-bold">Website</Label>
                    <Input
                        id="website"
                        type="url"
                        {...register("website")}
                        placeholder="https://yourbusiness.com"
                    />
                    {errors.website && (
                        <span className="text-xs text-red-600">{errors.website.message}</span>
                    )}
                </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <Button
                    type="submit"
                    className="gap-2"
                >
                    Save & Continue
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </form>
    )
}

// ==================== STEP 3: CONNECT BANK ====================

interface Step3Props {
    onComplete: () => void
    onBack: () => void
}

const Step3: React.FC<Step3Props> = ({ onComplete, onBack }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [stripeConnected, setStripeConnected] = useState(false)

    const connectStripe = async () => {
        setIsLoading(true)
        // Simulate Stripe connection
        setTimeout(() => {
            setStripeConnected(true)
            setIsLoading(false)
            onComplete()
        }, 1500)
    }

    return (
        <div className="space-y-6">
            <div className="text-center rounded-lg border border-dashed p-8">
                <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Connect Your Bank Account</h3>
                    <p className="text-sm text-muted-foreground">
                        Securely connect to Stripe to receive payments from customers
                    </p>
                    <Button
                        onClick={connectStripe}
                        disabled={isLoading || stripeConnected}
                        size="lg"
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Connecting...
                            </>
                        ) : stripeConnected ? (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Connected
                            </>
                        ) : (
                            "Connect with Stripe"
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        By connecting, you agree to Stripe&apos;s Terms of Service
                    </p>
                </div>
            </div>

            <div className="text-left space-y-3">
                <h4 className="font-medium">Why connect to Stripe?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Secure payment processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Automatic payouts to your bank</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>PCI compliant and secure</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Supports multiple payment methods</span>
                    </li>
                </ul>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <Button
                    type="button"
                    onClick={connectStripe}
                    disabled={isLoading || stripeConnected}
                    className="gap-2"
                >
                    {isLoading ? "Connecting..." : stripeConnected ? "Connected" : "Skip for now"}
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

// ==================== STEP 4: CONGRATULATIONS ====================

const Step4 = () => {
    return (
        <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Congratulations! 🎉</h3>
                <p className="text-muted-foreground">
                    Your account has been successfully created and you&apos;re ready to start selling!
                </p>
            </div>

            <div className="rounded-lg border p-6 space-y-4">
                <h4 className="font-medium">Next Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <div className="font-medium">1. Add Products</div>
                        <p className="text-muted-foreground">Start listing your products in your dashboard</p>
                    </div>
                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <div className="font-medium">2. Set Up Store</div>
                        <p className="text-muted-foreground">Customize your store appearance</p>
                    </div>
                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <div className="font-medium">3. Start Selling</div>
                        <p className="text-muted-foreground">Promote your store and make your first sale</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <Button size="lg" asChild>
                    <Link to="/dashboard">
                        Go to Dashboard
                    </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                    Check your email for a welcome message and next steps
                </p>
            </div>
        </div>
    )
}

// ==================== PROGRESS INDICATOR ====================

interface ProgressIndicatorProps {
    step: number
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ step }) => {
    const stepTitles = [
        "Create Account",
        "Setup Seller Profile",
        "Connect Bank Account",
        "Complete Setup"
    ]

    const progress = (step / 4) * 100

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-medium">Step {step} of 4</span>
                <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />

            <div className="flex justify-between relative">
                {[1, 2, 3, 4].map((stepNum) => (
                    <div key={stepNum} className="flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${stepNum < step ? 'bg-primary text-primary-foreground' :
                                    stepNum === step ? 'border-2 border-primary bg-background text-primary' :
                                        'border border-muted bg-background text-muted-foreground'}`}
                        >
                            {stepNum < step ? '✓' : stepNum}
                        </div>
                        <span className={`text-xs mt-1 ${stepNum <= step ? 'text-primary' : 'text-muted-foreground'}`}>
                            {stepTitles[stepNum - 1].split(' ')[0]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ==================== STEP 1 FOOTER ====================

const Step1Footer = () => {
    return (
        <>
            <Separator className="my-4" />
            <div className="text-xs leading-relaxed text-center">
                By creating an account, you agree to MarketHub&apos;s{" "}
                <Link to="#" className="text-blue-600 hover:underline">Conditions of Use</Link>{" "}
                and <Link to="#" className="text-blue-600 hover:underline">Privacy Notice</Link>.
            </div>


            <div className="text-sm space-y-2 mt-4">
                <div className="flex items-center justify-center gap-1">
                    <span>Already have an account?</span>
                    <Link
                        to="/auth/login"
                        className="text-blue-600 hover:underline hover:text-orange-700 font-medium"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </>
    )
}

// ==================== MAIN COMPONENT ====================

export default function RegisterPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<{
        account: AccountFormData | null
        seller: SellerFormData | null
    }>({
        account: null,
        seller: null
    })

    const stepTitles = [
        "Create Account",
        "Setup Seller Profile",
        "Connect Bank Account",
        "Complete Setup"
    ]

    const handleStep1Complete = (accountData: AccountFormData) => {
        setFormData(prev => ({ ...prev, account: accountData }))
        setStep(2)
    }

    const handleStep2Complete = (sellerData: SellerFormData) => {
        setFormData(prev => ({ ...prev, seller: sellerData }))
        setStep(3)
    }

    const handleStep3Complete = () => {
        setStep(4)
        // Here you would typically submit all data to your API
        console.log("Complete form data:", formData)
    }

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const getCurrentStep = () => {
        switch (step) {
            case 1:
                return <Step1 onComplete={handleStep1Complete} />
            case 2:
                return <Step2 onComplete={handleStep2Complete} onBack={goBack} />
            case 3:
                return <Step3 onComplete={handleStep3Complete} onBack={goBack} />
            case 4:
                return <Step4 />
            default:
                return <Step1 onComplete={handleStep1Complete} />
        }
    }

    return (
        <div className=" flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="pb-4">
                    <div className="space-y-4">
                        <CardTitle className="text-2xl font-normal text-center">
                            {stepTitles[step - 1]}
                        </CardTitle>

                        <ProgressIndicator step={step} />
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        {getCurrentStep()}

                        {step === 1 && <Step1Footer />}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}