"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    // Basic client-side validation
    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    setLoading(true)
    try {
      const res = await signIn("credentials", {
        email: String(email),
        password: String(password),
        redirect: false,
        callbackUrl: "/"
      })

      // If NextAuth returns an error, show it
      if (res && "error" in res && res.error) {
        setError(res.error)
      } else {
        // On success, redirect to callbackUrl if provided
        if (res && (res as any).url) {
          window.location.href = (res as any).url
        } else {
          window.location.href = "/"
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Announce reason for redirect if the login page was reached via middleware
  const [announce, setAnnounce] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cb = params.get('callbackUrl')
    if (cb) {
      setAnnounce(`You must sign in to view ${cb}. After signing in you will be returned to that page.`)
      // Move focus to heading for screen reader users
      const heading = document.getElementById('login-heading')
      heading?.focus()
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-80"
        onSubmit={handleSubmit}
        aria-labelledby="login-heading"
        noValidate
      >
        <h1 id="login-heading" tabIndex={-1} className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        {announce && (
          <div role="status" aria-live="polite" className="sr-only">{announce}</div>
        )}

        {error && (
          <div
            id="login-error"
            role="alert"
            aria-live="assertive"
            className="mb-4 p-2 bg-red-100 text-red-800 rounded"
          >
            {error}
          </div>
        )}

        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={error ? true : undefined}
          required
          className="w-full mb-4 p-2 border rounded"
        />

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={error ? true : undefined}
          required
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  )
}
