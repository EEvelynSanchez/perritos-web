"use client"

import { useEffect, useState } from "react"
import { LoginForm } from "@/components/LoginForm"

export default function LoginPage() {
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null)
  const [announce, setAnnounce] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cb = params.get("callbackUrl")
    if (cb) {
      setCallbackUrl(cb)
      setAnnounce(
        `You must sign in to view ${cb}. After signing in you will be returned to that page.`
      )
      const heading = document.getElementById("login-heading")
      heading?.focus()
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <h1 id="login-heading" tabIndex={-1} className="text-3xl font-bold mb-8 text-center">
          Sign in
        </h1>

        {announce && (
          <div role="status" aria-live="polite" className="sr-only">
            {announce}
          </div>
        )}

        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  )
}
