"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { signupSchema, type SignupFormData } from "@/lib/validationSchemas"
import { FormInput } from "@/components/FormInput"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur"
  })

  async function onSubmit(data: SignupFormData) {
    setServerError(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (!res.ok) {
        setServerError(result?.error || "Failed to create account")
        setFocus("email")
        return
      }

      // Auto sign in after successful signup
      const signInRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/"
      })

      if (signInRes?.error) {
        setServerError(signInRes.error)
        return
      }

      router.push("/")
    } catch {
      setServerError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-96">
      {serverError && (
        <div role="alert" className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded">
          {serverError}
        </div>
      )}

      <FormInput
        label="Name"
        type="text"
        placeholder="Your name"
        registration={register("name")}
        error={errors.name}
      />

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
        placeholder="At least 6 characters"
        registration={register("password")}
        error={errors.password}
        helperText="Use a strong password with letters, numbers, and symbols."
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          isLoading ? "opacity-60 cursor-not-allowed" : ""
        }`}
        aria-busy={isLoading}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          Sign in
        </a>
      </p>
    </form>
  )
}
