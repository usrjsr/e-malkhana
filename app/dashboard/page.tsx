import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ManageCasesClient from "@/app/cases/manage/manage-cases-client"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-[#1e3a8a] mb-2">Dashboard Overview</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Evidence and Case Management
            </p>
          </div>

          <div className="flex gap-3">
            {(session.user as any)?.role === "ADMIN" && (
              <Link
                href="/users/new"
                className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e3a8a] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                + Add User
              </Link>
            )}

            <Link
              href="/cases/new"
              className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e40af] transition-all duration-300 border-2 border-[#1e3a8a] shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              + New Case
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Cases Card */}
          <div className="bg-white border-2 border-[#1e3a8a] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Cases</p>
            </div>
            <p className="text-5xl font-bold text-[#1e3a8a] mb-2">{totalCases}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All registered cases
            </p>
          </div>

          {/* Pending Cases Card */}
          <div className="bg-white border-2 border-[#ffc107] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-[#ffc107] rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pending</p>
            </div>
            <p className="text-5xl font-bold text-[#ffc107] mb-2">{pendingCases}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Under custody
            </p>
          </div>

          {/* Disposed Cases Card */}
          <div className="bg-white border-2 border-[#28a745] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-[#28a745] rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Disposed</p>
            </div>
            <p className="text-5xl font-bold text-[#28a745] mb-2">{disposedCases}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed cases
            </p>
          </div>

          {/* Alerts Card */}
          <Link
            href="/alerts"
            className="bg-white border-2 border-[#dc3545] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-[#c82333] group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-[#dc3545] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Alerts</p>
            </div>
            <p className="text-5xl font-bold text-[#dc3545] mb-2">{alertCases}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Pending over 7 days
            </p>
          </Link>
        </div>

        {alertCases > 0 && (
          <div className="mb-8 bg-[#fff3cd] border-l-4 border-[#ffc107] p-5 rounded-lg shadow-md">
            <div className="flex items-start">
              <svg className="w-7 h-7 text-[#856404] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-[#856404] mb-2 text-lg">Attention Required</h4>
                <p className="text-sm text-[#856404]">
                  You have <span className="font-bold">{alertCases}</span> case(s) pending for more than 7 days. Please review and take necessary action.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border-2 border-gray-300 p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-2 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Manage Entries
          </h3>
          <p className="text-gray-600 mb-6">Search cases, view details, associated properties, and download case reports</p>

          <ManageCasesClient />
        </div>
      </div>
    </div>
  )
}