import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function CasesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  await dbConnect()

  const cases = await Case.find().sort({ createdAt: -1 })

  const totalCases = cases.length
  const pendingCases = cases.filter((c: any) => c.status === "PENDING").length
  const disposedCases = cases.filter((c: any) => c.status === "DISPOSED").length

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1e3a8a]">All Cases</h2>
            <p className="text-gray-600 mt-1">Complete case registry and management</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-2 font-semibold hover:bg-[#f8f9fa] transition-colors"
            >
              ← Dashboard
            </Link>
            <Link
              href="/cases/new"
              className="bg-[#1e3a8a] text-white px-6 py-2 font-semibold hover:bg-[#1e40af] transition-colors border-2 border-[#1e3a8a]"
            >
              + New Case
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        <div className="bg-white border-2 border-gray-300">
          <div className="bg-[#1e3a8a] text-white px-6 py-4">
            <h3 className="text-xl font-bold">Case Registry</h3>
            <p className="text-sm text-blue-200 mt-1">{totalCases} cases found</p>
          </div>

          {cases.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-semibold mb-2">No cases found</p>
              <p className="text-sm text-gray-500 mb-4">Start by creating your first case</p>
              <Link
                href="/cases/new"
                className="inline-block bg-[#1e3a8a] text-white px-6 py-2 font-semibold hover:bg-[#1e40af] transition-colors"
              >
                + Create New Case
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cases.map((c: any) => (
                <Link
                  key={c._id}
                  href={`/cases/${c._id}`}
                  className="block p-6 hover:bg-[#f8f9fa] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-[#1e3a8a]">
                          Crime {c.crimeNumber}/{c.crimeYear}
                        </h4>
                        <span className={`px-3 py-1 text-xs font-semibold ${
                          c.status === "PENDING" 
                            ? "bg-[#ffc107] text-[#856404]" 
                            : "bg-[#28a745] text-white"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{c.policeStationName}</span>
                        </div>
                        
                        {c.investigatingOfficer?.name && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>IO: {c.investigatingOfficer.name}</span>
                          </div>
                        )}
                        
                        {c.dateOfFIR && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>FIR: {new Date(c.dateOfFIR).toLocaleDateString('en-IN')}</span>
                          </div>
                        )}

                        {c.actAndLaw && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>{c.actAndLaw}</span>
                          </div>
                        )}
                        
                        {c.properties && c.properties.length > 0 && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>{c.properties.length} Properties</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Created: {new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <svg className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {cases.length > 0 && (
          <div className="mt-6 bg-[#e7f3ff] border-l-4 border-[#1e3a8a] p-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-[#1e3a8a] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-[#1e3a8a] mb-1">Quick Actions</h4>
                <p className="text-sm text-gray-700">
                  Click on any case to view details, manage properties, track chain of custody, or dispose evidence.
                  Use the search feature on the dashboard to quickly find specific cases.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    
    </div>
  )
}