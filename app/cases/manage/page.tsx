import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Property from "@/models/Property"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import ManageCasesClient from "./case-print-client"

export default async function ManageCasesPage() {
  const token = (await cookies()).get("token")?.value
  const payload = token ? verifyToken(token) : null

  if (!payload) {
    redirect("/login")
  }

  await dbConnect()

  const cases = await Case.find().sort({ createdAt: -1 })
  const properties = await Property.find()

  const caseData = cases.map((caseItem: any) => {
    const caseProperties = properties.filter(
      (p: any) => p.caseId.toString() === caseItem._id.toString()
    )
    return {
      ...caseItem.toObject(),
      totalProperties: caseProperties.length,
      pendingProperties: caseProperties.filter((p: any) => p.status === "PENDING").length,
      disposedProperties: caseProperties.filter((p: any) => p.status === "DISPOSED").length
    }
  })

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
              <p className="text-xs text-blue-300">Role: {payload.role}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-[#ff9933] h-2"></div>
      <div className="bg-white h-2"></div>
      <div className="bg-[#138808] h-2"></div>

      <div className="bg-[#f8f9fa] border-b border-gray-300">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1e3a8a]">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/dashboard" className="hover:text-[#1e3a8a]">Dashboard</Link>
              <span className="mx-2">/</span>
              <span className="text-[#1e3a8a] font-semibold">Manage Entries</span>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Logout →
              </button>
            </form>
          </div>
        </div>
      </div>

      <main className="px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#1e3a8a]">Manage Entries</h2>
          <p className="text-gray-600 mt-2">Search cases, view details, properties, and print information</p>
        </div>

        <ManageCasesClient cases={caseData} />
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
