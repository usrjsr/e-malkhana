"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewUserPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    officerId: "",
    policeStation: ""
  })

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      setError("Username must be 3-20 characters and contain only letters, numbers, and underscores")
      setIsLoading(false)
      return
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        role: form.role,
        officerId: form.officerId,
        policeStation: form.policeStation
      })
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to create user. Username may already exist.")
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1e3a8a] text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">EP</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">e-Malkhana</h1>
                <p className="text-sm text-blue-200">Digital Evidence Management System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-200">Government of India</p>
              <p className="text-xs text-blue-300">Ministry of Home Affairs</p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-[#ff9933] h-2"></div>
      <div className="bg-white h-2"></div>
      <div className="bg-[#138808] h-2"></div>

      <div className="bg-[#f8f9fa] border-b border-gray-300">
        <div className="px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1e3a8a]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/dashboard" className="hover:text-[#1e3a8a]">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1e3a8a] font-semibold">Create User</span>
          </div>
        </div>
      </div>

      <main className="px-4 py-8">
        <div className="mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#1e3a8a]">Create New User</h2>
            <p className="text-gray-600 mt-2">Add a new officer or admin to the system</p>
          </div>

          <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-[#856404] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-[#856404] mb-1">Admin Access Required</h4>
                <p className="text-sm text-[#856404]">
                  This action requires administrator privileges. Only authorized admins can create new user accounts.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-300">
            <div className="bg-[#1e3a8a] text-white px-6 py-4">
              <h3 className="text-xl font-bold">User Registration Form</h3>
              <p className="text-sm text-blue-200 mt-1">All fields marked with * are mandatory</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
                <h4 className="font-bold text-[#1e3a8a] mb-4">Login Credentials</h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter username (3-20 characters)"
                      value={form.username}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      required
                      disabled={isLoading}
                      pattern="[a-zA-Z0-9_]{3,20}"
                      title="Username must be 3-20 characters and contain only letters, numbers, and underscores"
                    />
                    <p className="text-xs text-gray-500 mt-1">Only letters, numbers, and underscores allowed</p>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password (minimum 8 characters)"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters required</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
                <h4 className="font-bold text-[#1e3a8a] mb-4">Officer Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="officerId" className="block text-sm font-semibold text-gray-700 mb-2">
                      Officer ID *
                    </label>
                    <input
                      id="officerId"
                      name="officerId"
                      type="text"
                      placeholder="Enter officer ID number"
                      value={form.officerId}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="policeStation" className="block text-sm font-semibold text-gray-700 mb-2">
                      Police Station *
                    </label>
                    <input
                      id="policeStation"
                      name="policeStation"
                      type="text"
                      placeholder="Enter police station name"
                      value={form.policeStation}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
                <h4 className="font-bold text-[#1e3a8a] mb-4">Access Level</h4>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    User Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                    disabled={isLoading}
                  >
                    <option value="USER">Officer (Standard Access)</option>
                    <option value="ADMIN">Admin (Full Access)</option>
                  </select>
                  <div className="mt-3 text-sm">
                    <div className="bg-white border border-gray-300 p-3 mb-2">
                      <p className="font-semibold text-gray-700 mb-1">Officer Access:</p>
                      <ul className="text-gray-600 text-xs space-y-1 ml-4">
                        <li>• Create and manage cases</li>
                        <li>• Add and track properties</li>
                        <li>• Record chain of custody</li>
                        <li>• View case reports</li>
                      </ul>
                    </div>
                    <div className="bg-white border border-gray-300 p-3">
                      <p className="font-semibold text-gray-700 mb-1">Admin Access:</p>
                      <ul className="text-gray-600 text-xs space-y-1 ml-4">
                        <li>• All officer permissions</li>
                        <li>• Create and manage users</li>
                        <li>• Dispose of properties</li>
                        <li>• System configuration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-[#721c24] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-[#721c24] font-semibold">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#1e3a8a] text-white py-3 font-bold hover:bg-[#1e40af] transition-colors border-2 border-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating User...
                    </span>
                  ) : (
                    "CREATE USER"
                  )}
                </button>

                <Link
                  href="/dashboard"
                  className="bg-gray-200 text-gray-700 px-8 py-3 font-bold hover:bg-gray-300 transition-colors"
                >
                  CANCEL
                </Link>
              </div>
            </div>
          </form>

          <div className="mt-6 bg-[#e7f3ff] border-l-4 border-[#1e3a8a] p-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-[#1e3a8a] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-[#1e3a8a] mb-1">Security Note</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• User credentials should be kept confidential</li>
                  <li>• Users will be able to change their password after first login</li>
                  <li>• Admin privileges should be granted cautiously</li>
                  <li>• All user activities are logged for audit purposes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#1e3a8a] text-white mt-16">
        <div className="px-4 py-6">
          <div className="text-center text-sm text-blue-200">
            <p>© 2025 Government of India. All rights reserved.</p>
            <p className="mt-2">e-Malkhana - Digital Evidence Management System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}