import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import ManageCasesClient from "@/app/cases/manage/manage-cases-client"

export default async function DashboardPage() {
  const token = (await cookies()).get("token")?.value
  const payload = token ? verifyToken(token) : null

  if (!payload) {
    redirect("/login")
  }

  await dbConnect()

  const totalCases = await Case.countDocuments({})
  const pendingCases = await Case.countDocuments({ status: "PENDING" })
  const disposedCases = await Case.countDocuments({ status: "DISPOSED" })

  const threshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const alertCases = await Case.countDocuments({
    status: "PENDING",
    createdAt: { $lt: threshold }
  })


  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#1e3a8a]">Dashboard Overview</h2>
            <p className="text-gray-600 mt-1">Evidence and Case Management</p>
          </div>

          <div className="flex gap-3">
            {payload.role === "ADMIN" && (
              <Link
                href="/users/new"
                className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-2 font-semibold hover:bg-[#f8f9fa] transition-colors"
              >
                + Add User
              </Link>
            )}

            <Link
              href="/cases/new"
              className="bg-[#1e3a8a] text-white px-6 py-2 font-semibold hover:bg-[#1e40af] transition-colors border-2 border-[#1e3a8a]"
            >
              + New Case
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-[#1e3a8a] p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase">Total Cases</p>
            </div>
            <p className="text-4xl font-bold text-[#1e3a8a]">{totalCases}</p>
            <p className="text-xs text-gray-500 mt-2">All registered cases</p>
          </div>

          <div className="bg-white border-2 border-[#ffc107] p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-[#ffc107] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase">Pending</p>
            </div>
            <p className="text-4xl font-bold text-[#ffc107]">{pendingCases}</p>
            <p className="text-xs text-gray-500 mt-2">Under custody</p>
          </div>

          <div className="bg-white border-2 border-[#28a745] p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-[#28a745] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase">Disposed</p>
            </div>
            <p className="text-4xl font-bold text-[#28a745]">{disposedCases}</p>
            <p className="text-xs text-gray-500 mt-2">Completed cases</p>
          </div>

          <Link
            href="/alerts"
            className="bg-white border-2 border-[#dc3545] p-6 hover:bg-[#fff5f5] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-[#dc3545] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase">Alerts</p>
            </div>
            <p className="text-4xl font-bold text-[#dc3545]">{alertCases}</p>
            <p className="text-xs text-gray-500 mt-2">Pending over 7 days</p>
          </Link>
        </div>

        {alertCases > 0 && (
          <div className="mb-8 bg-[#fff3cd] border-l-4 border-[#ffc107] p-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-[#856404] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-[#856404] mb-1">Attention Required</h4>
                <p className="text-sm text-[#856404]">
                  You have {alertCases} case(s) pending for more than 7 days. Please review and take necessary action.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border-2 border-gray-300 p-6 mb-8">
          <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">Manage Entries</h3>
          <p className="text-gray-600 mb-6">Search cases, view details, associated properties, and download case reports</p>
          
          <ManageCasesClient />
        </div>
      </div>
    </div>
  )
}