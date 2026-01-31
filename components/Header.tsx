"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import LogoutButton from "./LogoutButton"

export default function Header() {
  const pathname = usePathname()
  const isDashboard = pathname.includes("/dashboard") || pathname.includes("/cases") || pathname.includes("/properties") || pathname.includes("/reports") || pathname.includes("/alerts")

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
          
          {isDashboard && (
            <div className="flex items-center gap-6">
              <div className="flex items-center text-sm text-gray-200">
                <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                <span className="mx-2">/</span>
                <span className="text-blue-300">{pathname.split("/")[1]}</span>
              </div>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
