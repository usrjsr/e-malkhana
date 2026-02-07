import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Property from "@/models/Property"
import CustodyLog from "@/models/CustodyLog"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import CasePrintClient from "../manage/case-print-client"

type Props = {
  params: Promise<{
    caseId: string
  }>
}

export default async function CaseDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) {
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
    const key = log.propertyId.toString()
    if (!acc[key]) acc[key] = log
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 px-4 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-2 flex items-center gap-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Case {caseData.crimeNumber}/{caseData.crimeYear}
          </h2>
          <p className="text-gray-600 ml-1 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {caseData.policeStationName}
          </p>
          <span
            className={`inline-block mt-3 px-4 py-1.5 text-sm font-bold rounded-full shadow-md ${caseData.status === "DISPOSED"
              ? "bg-[#28a745] text-white"
              : "bg-[#ffc107] text-[#856404]"
              }`}
          >
            {caseData.status}
          </span>
        </div>

        <div className="flex gap-3">
          <CasePrintClient />
          <Link
            href="/dashboard"
            className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e3a8a] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      
      <div className="mb-8 bg-white border-2 border-gray-300 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-[#1e3a8a] mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Case Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-[#1e3a8a]">
            <p className="text-sm font-semibold text-gray-600 mb-1">Investigating Officer</p>
            <p className="text-lg font-bold text-gray-900">{caseData.investigatingOfficer.name}</p>
          </div>

          <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-[#1e3a8a]">
            <p className="text-sm font-semibold text-gray-600 mb-1">Officer ID</p>
            <p className="text-lg font-bold text-gray-900">{caseData.investigatingOfficer.officerId}</p>
          </div>

          <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-[#1e3a8a]">
            <p className="text-sm font-semibold text-gray-600 mb-1">Date of FIR</p>
            <p className="text-lg font-bold text-gray-900">
              {caseData.dateOfFIR ? new Date(caseData.dateOfFIR).toLocaleDateString("en-IN") : "N/A"}
            </p>
          </div>

          <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-[#1e3a8a]">
            <p className="text-sm font-semibold text-gray-600 mb-1">Date of Seizure</p>
            <p className="text-lg font-bold text-gray-900">
              {caseData.dateOfSeizure ? new Date(caseData.dateOfSeizure).toLocaleDateString("en-IN") : "N/A"}
            </p>
          </div>

          {caseData.actAndLaw && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-[#1e3a8a]">
              <p className="text-sm font-semibold text-gray-600 mb-1">Act & Law</p>
              <p className="text-lg font-bold text-gray-900">{caseData.actAndLaw}</p>
            </div>
          )}

          {caseData.sections && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-[#1e3a8a]">
              <p className="text-sm font-semibold text-gray-600 mb-1">Sections</p>
              <p className="text-lg font-bold text-gray-900">{caseData.sections}</p>
            </div>
          )}
        </div>
      </div>

      
      <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="flex justify-between items-center bg-[#1e3a8a] text-white px-6 py-5">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Seized Properties
            </h3>
            <p className="text-sm text-blue-200 mt-1">{properties.length} properties on record</p>
          </div>
          <Link
            href={`/cases/${caseId}/properties/new`}
            className="bg-white text-[#1e3a8a] px-6 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            + Add Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-600 font-semibold mb-2 text-lg">No properties added yet</p>
            <p className="text-sm text-gray-500 mb-6">Start by adding the first seized property</p>
            <Link
              href={`/cases/${caseId}/properties/new`}
              className="inline-block bg-[#1e3a8a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              + Add First Property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {properties.map((p: any) => {
              const last = lastLogByProperty[p._id.toString()]

              return (
                <div key={p._id} className="p-6 hover:bg-blue-50 transition-all duration-200">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-[#1e3a8a] rounded-lg flex items-center justify-center shadow-md">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-gray-900">{p.category}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {p.nature} | {p.location}
                          </p>
                        </div>
                      </div>

                      <div className="ml-14 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-600">Status:</span>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${p.status === "DISPOSED"
                            ? "bg-[#28a745] text-white"
                            : "bg-[#ffc107] text-[#856404]"
                            }`}>
                            {p.status}
                          </span>
                        </div>

                        {last ? (
                          <div className="bg-blue-50 border-l-4 border-[#1e3a8a] p-3 rounded-r-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Last movement:</span> {last.from} → {last.to}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Purpose:</span> {last.purpose}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border-l-4 border-[#ffc107] p-3 rounded-r-lg">
                            <p className="text-sm text-[#856404] font-semibold">No custody movement yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/cases/${caseId}/properties/${p._id}`}
                        className="bg-[#1e3a8a] text-white px-4 py-2.5 text-sm font-semibold rounded-lg text-center hover:bg-[#1e40af] transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        View Details
                      </Link>

                      <Link
                        href={`/cases/${caseId}/properties/${p._id}/custody`}
                        className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-4 py-2.5 text-sm font-semibold rounded-lg text-center hover:bg-[#1e3a8a] hover:text-white transition-all duration-300 shadow-md"
                      >
                        Custody Log
                      </Link>

                      {(session.user as any).role === "ADMIN" && p.status !== "DISPOSED" && (
                        <Link
                          href={`/cases/${caseId}/properties/${p._id}/disposal`}
                          className="bg-white border-2 border-[#dc3545] text-[#dc3545] px-4 py-2.5 text-sm font-semibold rounded-lg text-center hover:bg-[#dc3545] hover:text-white transition-all duration-300 shadow-md"
                        >
                          Dispose
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      
      <div className="bg-[#e7f3ff] border-l-4 border-[#1e3a8a] p-5 rounded-lg shadow-md">
        <div className="flex items-start">
          <svg className="w-7 h-7 text-[#1e3a8a] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-bold text-[#1e3a8a] mb-2 text-lg">Case Management</h4>
            <ul className="text-sm text-gray-700 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#1e3a8a] font-bold">•</span>
                <span>Add properties seized during investigation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1e3a8a] font-bold">•</span>
                <span>Track chain of custody for each property</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1e3a8a] font-bold">•</span>
                <span>Dispose properties with proper authorization and court orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1e3a8a] font-bold">•</span>
                <span>Download case reports and property documentation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}