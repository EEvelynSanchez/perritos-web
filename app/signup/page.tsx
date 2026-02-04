"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")
    const name = String(form.get("name") || "")

    if (!email || !password) {
      setError("Please complete all required fields.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Failed to create account")
        return
      }

      // Sign in after successful signup
      const signInRes = await signIn("credentials", { email, password, redirect: false })
      if (signInRes && (signInRes as any).error) {
        setError((signInRes as any).error)
        return
      }

      // Redirect to home
      router.push("/")
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit} aria-labelledby="signup-heading">
        <h1 id="signup-heading" className="text-2xl font-bold mb-6 text-center">Create account</h1>

        {error && (
          <div role="alert" aria-live="assertive" className="mb-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>
        )}

        <label htmlFor="name" className="sr-only">Name</label>
        <input id="name" name="name" type="text" placeholder="Name (optional)" className="w-full mb-4 p-2 border rounded" />

        <label htmlFor="email" className="sr-only">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" required className="w-full mb-4 p-2 border rounded" />

        <label htmlFor="password" className="sr-only">Password</label>
        <input id="password" name="password" type="password" placeholder="Password (min 6 chars)" required className="w-full mb-4 p-2 border rounded" />

        <button type="submit" disabled={loading} aria-disabled={loading} className={`w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm mt-4 text-center">Already have an account? <a href="/login" className="text-blue-600 underline">Log in</a></p>
      </form>
    </div>
  )
}