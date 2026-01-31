import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Property from "@/models/Property"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import ReportPrintClient from "./report-print-client"

export default async function ReportsPage() {
  const token = (await cookies()).get("token")?.value
  const payload = token ? verifyToken(token) : null

  if (!payload) {
    redirect("/login")
  }

  await dbConnect()

  const cases = await Case.find().sort({ createdAt: -1 })
  const properties = await Property.find()

  const caseStats = cases.map((caseItem: any) => {
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

      <main className="px-4 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1e3a8a]">Case Reports</h2>
            <p className="text-gray-600 mt-2">View and print detailed case reports</p>
          </div>
          <ReportPrintClient />
        </div>

        <div className="bg-white border-2 border-gray-300">
          <div className="bg-[#1e3a8a] text-white px-6 py-4">
            <h3 className="text-xl font-bold">All Cases Summary</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-[#f8f9fa]">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Crime Number</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Police Station</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Crime Year</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Total Properties</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Pending</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Disposed</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {caseStats.map((caseItem: any, idx: number) => (
                  <tr key={caseItem._id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'}`}>
                    <td className="px-6 py-4 font-semibold text-[#1e3a8a]">
                      {caseItem.crimeNumber}/{caseItem.crimeYear}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{caseItem.policeStationName}</td>
                    <td className="px-6 py-4 text-gray-700">{caseItem.crimeYear}</td>
                    <td className="px-6 py-4 text-center font-bold text-[#1e3a8a]">{caseItem.totalProperties}</td>
                    <td className="px-6 py-4 text-center font-bold text-[#ffc107]">{caseItem.pendingProperties}</td>
                    <td className="px-6 py-4 text-center font-bold text-[#28a745]">{caseItem.disposedProperties}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm font-semibold rounded ${
                        caseItem.status === "PENDING"
                          ? "bg-[#ffc107] text-[#856404]"
                          : "bg-[#28a745] text-white"
                      }`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/cases/${caseItem._id}`}
                        className="text-[#1e3a8a] font-semibold hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-gray-300 p-6 text-center">
            <p className="text-gray-600 font-semibold mb-2">Total Cases</p>
            <p className="text-4xl font-bold text-[#1e3a8a]">{cases.length}</p>
          </div>

          <div className="bg-white border-2 border-gray-300 p-6 text-center">
            <p className="text-gray-600 font-semibold mb-2">Total Properties</p>
            <p className="text-4xl font-bold text-[#1e3a8a]">{properties.length}</p>
          </div>

          <div className="bg-white border-2 border-gray-300 p-6 text-center">
            <p className="text-gray-600 font-semibold mb-2">Disposed Properties</p>
            <p className="text-4xl font-bold text-[#28a745]">
              {properties.filter((p: any) => p.status === "DISPOSED").length}
            </p>
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
