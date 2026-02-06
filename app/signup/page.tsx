"use client"

import { SignupForm } from "@/components/SignupForm"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Create account</h1>
        <SignupForm />
      </div>
    </div>
  )
}