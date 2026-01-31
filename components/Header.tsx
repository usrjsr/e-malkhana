"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const isDashboard = pathname.includes("/dashboard") || pathname.includes("/cases") || pathname.includes("/properties") || pathname.includes("/reports") || pathname.includes("/alerts")

  const handleLogout = async () => {
    setIsLoading(true)
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <header className="bg-[#1e3a8a] text-white">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">EP</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">e-Malkhana</h1>
              <p className="text-sm text-blue-200">Digital Evidence Management System</p>
            </div>
          </Link>
          
          {isDashboard && session && (
            <div className="flex items-center gap-6">
              <div className="flex items-center text-sm text-gray-200">
                <span>Welcome, {session.user?.name}</span>
                {(session.user as any)?.role === "ADMIN" && (
                  <span className="ml-2 px-2 py-1 bg-yellow-500 text-yellow-900 rounded text-xs font-bold">ADMIN</span>
                )}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
