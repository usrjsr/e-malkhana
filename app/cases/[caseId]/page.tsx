import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Property from "@/models/Property"
import CustodyLog from "@/models/CustodyLog"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import CasePrintClient from "../manage/case-print-client"

type Props = {
  params: Promise<{
    caseId: string
  }>
}

export default async function CaseDetailPage({ params }: Props) {
  const token = (await cookies()).get("token")?.value
  const payload = token ? verifyToken(token) : null

  if (!payload) {
    redirect("/login")
  }

  const { caseId } = await params

  await dbConnect()

  const caseData = await Case.findById(caseId)
  if (!caseData) {
    notFound()
  }

  const properties = await Property.find({ caseId })

  const logs = await CustodyLog.find({
    propertyId: { $in: properties.map(p => p._id) }
  }).sort({ timestamp: -1 })

  const lastLogByProperty = logs.reduce((acc: any, log: any) => {
    const k = log.propertyId.toString()
    if (!acc[k]) acc[k] = log
    return acc
  }, {})

  const pendingProperties = properties.filter((p: any) => p.status === "PENDING")
  const disposedProperties = properties.filter((p: any) => p.status === "DISPOSED")

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1e3a8a]">
              Case {caseData.crimeNumber}/{caseData.crimeYear}
            </h2>
            <p className="text-gray-600 mt-1">{caseData.policeStationName}</p>
            <div className="mt-2">
              <span className={`px-3 py-1 text-sm font-semibold ${
                caseData.status === "PENDING" 
                  ? "bg-[#ffc107] text-[#856404]" 
                  : "bg-[#28a745] text-white"
              }`}>
                {caseData.status}
              </span>
            </div>
          </div>

          <div className="flex gap-3" data-no-print="true">
            <CasePrintClient />
            <Link
              href="/dashboard"
              className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-2 font-semibold hover:bg-[#f8f9fa] transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white border-2 border-gray-300 print-section">
            <div className="bg-[#1e3a8a] text-white px-6 py-4 print-section-title">
              <h3 className="text-xl font-bold">Case Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Investigating Officer</p>
                <p className="text-gray-900">{caseData.investigatingOfficer.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Officer ID</p>
                <p className="text-gray-900">{caseData.investigatingOfficer.officerId}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Date of FIR</p>
                <p className="text-gray-900">{caseData.dateOfFIR ? new Date(caseData.dateOfFIR).toLocaleDateString('en-IN') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Date of Seizure</p>
                <p className="text-gray-900">{caseData.dateOfSeizure ? new Date(caseData.dateOfSeizure).toLocaleDateString('en-IN') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Act & Law</p>
                <p className="text-gray-900">{caseData.actAndLaw || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Sections</p>
                <p className="text-gray-900">{caseData.sections || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300">
            <div className="bg-[#1e3a8a] text-white px-6 py-4">
              <h3 className="text-xl font-bold">Property Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
                <p className="text-sm font-semibold text-gray-600">Total Properties</p>
                <p className="text-3xl font-bold text-[#1e3a8a]">{properties.length}</p>
              </div>
              <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4">
                <p className="text-sm font-semibold text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-[#ffc107]">{pendingProperties.length}</p>
              </div>
              <div className="bg-[#d4edda] border-l-4 border-[#28a745] p-4">
                <p className="text-sm font-semibold text-gray-600">Disposed</p>
                <p className="text-3xl font-bold text-[#28a745]">{disposedProperties.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 mb-8 print-section">
          <div className="bg-[#1e3a8a] text-white px-6 py-4 print-section-title flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Seized Properties</h3>
              <p className="text-sm text-blue-200 mt-1">{properties.length} items in custody</p>
            </div>
            <Link
              href={`/cases/${caseId}/properties/new`}
              className="bg-white text-[#1e3a8a] px-6 py-2 font-semibold hover:bg-blue-50 transition-colors"
              data-no-print="true"
            >
              + Add Property
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-600 font-semibold mb-2">No properties added yet</p>
              <p className="text-sm text-gray-500">Click "Add Property" to register seized items</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {properties.map((p: any) => {
                const last = lastLogByProperty[p._id.toString()]

                return (
                  <div key={p._id} className="p-6 hover:bg-[#f8f9fa] transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-[#1e3a8a]">{p.category}</h4>
                          <span className={`px-3 py-1 text-xs font-semibold ${
                            p.status === "PENDING" 
                              ? "bg-[#ffc107] text-[#856404]" 
                              : "bg-[#28a745] text-white"
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>{p.nature}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{p.location}</span>
                          </div>

                          {p.quantity && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                              </svg>
                              <span>{p.quantity} {p.unit || 'units'}</span>
                            </div>
                          )}

                          {p.belongingTo && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>Belongs to: {p.belongingTo}</span>
                            </div>
                          )}
                        </div>

                        {p.description && (
                          <div className="mt-3 text-sm text-gray-700 bg-[#f8f9fa] p-3 border-l-4 border-gray-300">
                            <p className="font-semibold text-gray-600 mb-1">Description:</p>
                            <p>{p.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Link
                          href={`/cases/${caseId}/properties/${p._id}`}
                          className="bg-[#1e3a8a] text-white px-4 py-2 text-sm font-semibold hover:bg-[#1e40af] transition-colors text-center"
                        >
                          View Details
                        </Link>

                        <Link
                          href={`/cases/${caseId}/properties/${p._id}/custody`}
                          className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-4 py-2 text-sm font-semibold hover:bg-[#f8f9fa] transition-colors text-center"
                        >
                          Custody Log
                        </Link>

                        {payload.role === "ADMIN" && p.status !== "DISPOSED" && (
                          <Link
                            href={`/cases/${caseId}/properties/${p._id}/disposal`}
                            className="bg-[#dc3545] text-white px-4 py-2 text-sm font-semibold hover:bg-[#c82333] transition-colors text-center"
                          >
                            Dispose
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#e7f3ff] border-l-4 border-[#1e3a8a] p-3">
                      <p className="text-sm font-semibold text-[#1e3a8a] mb-1">Latest Custody Movement</p>
                      {last ? (
                        <div className="text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <span><strong>From:</strong> {last.from} → <strong>To:</strong> {last.to}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span><strong>Purpose:</strong> {last.purpose} | {new Date(last.timestamp).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No custody movements recorded yet</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}