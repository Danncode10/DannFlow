"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

import { AuthShell } from "@/components/auth/AuthShell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { forgotPasswordRateLimited } from "@/services/auth-server"

function getErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again."
  }

  const message = error.message.toLowerCase()

  if (message.includes("fetch failed") || message.includes("failed to fetch")) {
    return "Could not reach Supabase. Check that the project is active and try again."
  }

  return error.message
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Enter the email address for your account.")
      return
    }

    setLoading(true)

    try {
      await forgotPasswordRateLimited(
        email,
        `${window.location.origin}/reset-password`
      )
      setSent(true)
      toast.success("Reset email sent", {
        description: "Check your inbox for the password reset link.",
      })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell showBrandPanel={false}>
      <Card className="w-full max-w-md rounded-lg border-border bg-card shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Forgot password
          </CardTitle>
          <CardDescription className="leading-6">
            Enter your email and we will send a secure recovery link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="rounded-lg border border-border bg-muted p-4 text-center">
              <p className="font-semibold text-foreground">Check your inbox</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                If the account exists, a password reset link is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "forgot-password-error" : undefined}
                    className="min-h-12 w-full rounded-lg border border-input bg-background py-3 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                    placeholder="dann@example.com"
                  />
                </div>
              </div>

              {error ? (
                <div
                  id="forgot-password-error"
                  className="rounded-lg border border-destructive/40 bg-card p-3 text-sm text-destructive"
                >
                  {error}
                </div>
              ) : null}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Sending" : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <Button asChild variant="ghost" className="px-3">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </AuthShell>
  )
}
