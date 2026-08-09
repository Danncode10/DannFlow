"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { AuthShell } from "@/components/auth/AuthShell"
import { Button } from "@/components/ui/button"
import {
  signInWithEmailRateLimited,
  forgotPasswordRateLimited,
  signUpWithEmailRateLimited,
} from "@/services/auth-server"
import { signInWithOAuthProvider } from "@/services/auth"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup" | "recovery"

type FieldErrors = {
  name?: string
  email?: string
  password?: string
}

const passwordLabels = ["Weak", "Fair", "Good", "Strong"]
const passwordTones = [
  {
    bar: "bg-password-weak",
    text: "text-password-weak",
    border: "border-password-weak text-password-weak",
  },
  {
    bar: "bg-password-fair",
    text: "text-password-fair",
    border: "border-password-fair text-password-fair",
  },
  {
    bar: "bg-password-good",
    text: "text-password-good",
    border: "border-password-good text-password-good",
  },
  {
    bar: "bg-password-strong",
    text: "text-password-strong",
    border: "border-password-strong text-password-strong",
  },
]

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
  )
}

function getPasswordScore(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

function getErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again."
  }

  const message = error.message.toLowerCase()

  if (message.includes("fetch failed") || message.includes("failed to fetch")) {
    return "Could not reach Supabase. Check that the project is active and your environment URL is correct."
  }

  if (message.includes("invalid login")) {
    return "The email or password does not match an account."
  }

  if (message.includes("password")) {
    return "Use a stronger password before creating your account."
  }

  if (message.includes("provider") || message.includes("oauth")) {
    return "Google login is not configured yet. Check the Supabase provider and redirect URLs."
  }

  return error.message
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resetSentTo, setResetSentTo] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const router = useRouter()

  const passwordScore = useMemo(() => getPasswordScore(password), [password])
  const passwordChecks = useMemo(
    () => [
      { label: "8 characters", passed: password.length >= 8 },
      { label: "Uppercase letter", passed: /[A-Z]/.test(password) },
      { label: "Number", passed: /[0-9]/.test(password) },
      { label: "Symbol", passed: /[^A-Za-z0-9]/.test(password) },
    ],
    [password]
  )
  const isStrongEnough = passwordScore >= 3
  const passwordTone =
    passwordScore > 0
      ? passwordTones[passwordScore - 1]
      : {
          bar: "bg-muted",
          text: "text-muted-foreground",
          border: "border-border text-muted-foreground",
        }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const savedMode = localStorage.getItem("df_auth_mode")
      if (savedMode === "login" || savedMode === "signup") {
        setMode(savedMode)
      }

      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.get("mode") === "recovery") {
        setMode("recovery")
        setSuccess(false)
        setResetSentTo("")
      }

      if (searchParams.get("error") === "confirmation_failed") {
        setError("We could not complete that auth link. Please try again.")
      }
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    if (nextMode === "login" || nextMode === "signup") {
      localStorage.setItem("df_auth_mode", nextMode)
    }
    setError("")
    setFieldErrors({})
    setSuccess(false)
    setResetSentTo("")
    if (nextMode !== "recovery") {
      setEmail("")
    }
    setPassword("")
    setName("")
  }

  const validateForm = () => {
    const nextErrors: FieldErrors = {}

    if (!email.trim()) {
      nextErrors.email = "Enter an email address."
    }

    if (mode !== "recovery" && !password) {
      nextErrors.password = "Enter your password."
    }

    if (mode === "signup") {
      if (!name.trim()) {
        nextErrors.name = "Enter your full name."
      }

      if (!isStrongEnough) {
        nextErrors.password =
          "Use at least 3 password requirements before creating an account."
      }
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (mode === "recovery") {
        await forgotPasswordRateLimited(
          email,
          `${window.location.origin}/reset-password`
        )
        setResetSentTo(email)
        toast.success("Reset email sent", {
          description: `Check ${email} for the setup link.`,
        })
        return
      }

      if (mode === "login") {
        const result = await signInWithEmailRateLimited(email, password)

        if (result.requiresMFA) {
          router.push("/auth/mfa")
          return
        }

        setSuccess(true)
        toast.success("Login successful")
        router.push("/dashboard")
        router.refresh()
        return
      }

      await signUpWithEmailRateLimited(
        email,
        password,
        window.location.origin,
        name.trim()
      )
      setSuccess(true)
      toast.success("Account created", {
        description: "Check your email for the confirmation link.",
      })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setOauthLoading(true)

    try {
      await signInWithOAuthProvider("google")
    } catch (err) {
      setError(getErrorMessage(err))
      setOauthLoading(false)
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setError("")
    setFieldErrors((current) => ({ ...current, password: undefined }))
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setError("")
    setResetSentTo("")
    setFieldErrors((current) => ({ ...current, email: undefined }))
  }

  return (
    <AuthShell>
      <div className="w-full max-w-[26rem]">
        {mode !== "recovery" ? (
          <div className="mb-8 grid grid-cols-2 gap-1 rounded-lg border border-border bg-card p-1">
            {(["login", "signup"] as const).map((item) => (
              <Button
                key={item}
                type="button"
                variant={mode === item ? "default" : "ghost"}
                className="h-12"
                onClick={() => switchMode(item)}
              >
                {item === "login" ? "Sign In" : "Create Account"}
              </Button>
            ))}
          </div>
        ) : null}

        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {mode === "login"
              ? "Welcome back"
              : mode === "signup"
                ? "Start building"
                : "Reset password"}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {mode === "login"
              ? "Access Mission Control with email or Google."
              : mode === "signup"
                ? "Create your account with stronger defaults from the start."
                : email
                  ? `Send a secure setup link to ${email}.`
                  : "Enter your account email and we will send a secure setup link."}
          </p>
        </div>

        {resetSentTo ? (
          <div className="rounded-lg border border-border bg-card p-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-password-strong bg-muted text-password-strong">
              <Check className="h-5 w-5" />
            </div>
            <p className="font-semibold">Reset email sent</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We sent a setup link to <span className="text-foreground">{resetSentTo}</span>.
              Make sure this is your email, then open the link to create a new
              password.
            </p>
            <Button
              type="button"
              variant="ghost"
              className="mt-5"
              onClick={() => switchMode("login")}
            >
              Back to Sign In
            </Button>
          </div>
        ) : success ? (
          <div className="rounded-lg border border-border bg-card p-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted text-primary">
              <Check className="h-5 w-5" />
            </div>
            <p className="font-semibold">
              {mode === "login" ? "Welcome back" : "Account created"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "login"
                ? "Taking you to the dashboard."
                : "Check your inbox for the confirmation email."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === "signup" ? (
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Full name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      setFieldErrors((current) => ({
                        ...current,
                        name: undefined,
                      }))
                    }}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                    className="min-h-12 w-full rounded-lg border border-input bg-card py-3 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                    placeholder="Lester Dann G. Lopez"
                  />
                </div>
                {fieldErrors.name ? (
                  <p id="name-error" className="text-sm text-destructive">
                    {fieldErrors.name}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => handleEmailChange(event.target.value)}
                  required
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className="min-h-12 w-full rounded-lg border border-input bg-card py-3 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                  placeholder="dann@example.com"
                />
              </div>
              {fieldErrors.email ? (
                <p id="email-error" className="text-sm text-destructive">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            {mode !== "recovery" ? (
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    required
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password ? "password-error" : "password-help"
                    }
                    className="min-h-12 w-full rounded-lg border border-input bg-card py-3 pl-10 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                    placeholder={mode === "login" ? "Your password" : "Min. 8 characters"}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {mode === "signup" ? (
                  <div id="password-help" className="space-y-2">
                    <div className="grid grid-cols-4 gap-1">
                      {[0, 1, 2, 3].map((index) => (
                        <span
                          key={index}
                          className={cn(
                            "h-1 rounded-full bg-muted",
                            index < passwordScore && passwordTone.bar
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className={cn("font-semibold", passwordTone.text)}>
                        {password
                          ? passwordLabels[passwordScore - 1] ?? "Weak"
                          : "Password strength"}
                      </span>
                      {passwordChecks.map((check) => (
                        <span
                          key={check.label}
                          className={cn(
                            "rounded-md border border-border bg-card px-2 py-1",
                            check.passed && passwordTone.border
                          )}
                        >
                          {check.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {fieldErrors.password ? (
                  <p id="password-error" className="text-sm text-destructive">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>
            ) : null}

            {mode === "login" ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => switchMode("recovery")}
                >
                  Forgot password?
                </button>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-destructive/40 bg-card p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || oauthLoading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading
                ? "Processing"
                : mode === "login"
                  ? "Sign In"
                  : mode === "signup"
                    ? "Create Account"
                    : "Send Reset Link"}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </Button>

            {mode === "signup" ? (
              <p className="text-center text-xs leading-5 text-muted-foreground">
                By signing up you agree to the{" "}
                <Link href="#" className="text-primary hover:text-foreground">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:text-foreground">
                  Privacy Policy
                </Link>
                .
              </p>
            ) : null}
          </form>
        )}

        {mode === "recovery" ? (
          <Button
            type="button"
            variant="ghost"
            className="mt-4 w-full"
            onClick={() => switchMode("login")}
          >
            Back to Sign In
          </Button>
        ) : (
          <>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Or
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading || oauthLoading}
            >
              {oauthLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </Button>
          </>
        )}
      </div>
    </AuthShell>
  )
}
