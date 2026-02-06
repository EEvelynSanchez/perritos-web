"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { loginSchema, type LoginFormData } from "@/lib/validationSchemas"
import { FormInput } from "@/components/FormInput"

interface LoginFormProps {
  callbackUrl?: string | null
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur"
  })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    setIsLoading(true)

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: callbackUrl || "/"
      })

      if (res?.error) {
        setServerError(res.error)
        setFocus("email")
        return
      }

      if (res?.url) {
        router.push(res.url)
      } else {
        router.push(callbackUrl || "/")
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-80">
      {serverError && (
        <div role="alert" className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded">
          {serverError}
        </div>
      )}

      <FormInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        registration={register("email")}
        error={errors.email}
        required
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="Your password"
        registration={register("password")}
        error={errors.password}
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isLoading ? "opacity-60 cursor-not-allowed" : ""
        }`}
        aria-busy={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline font-medium">
          Create one
        </a>
      </p>
    </form>
  )
}
