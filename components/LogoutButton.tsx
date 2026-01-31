"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST"
      })

      if (response.ok) {
        router.push("/login")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  )
}
