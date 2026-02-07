"use client"

import { useState } from "react"
import Link from "next/link"

export default function ManageCasesClient() {
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null)
  const [caseProperties, setCaseProperties] = useState<{ [key: string]: any[] }>({})
  const [loadingProperties, setLoadingProperties] = useState<{ [key: string]: boolean }>({})

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("q", searchQuery)
      if (statusFilter !== "ALL") params.append("status", statusFilter)

      const res = await fetch(`/api/cases?${params.toString()}`)
      const data = await res.json()
      setCases(data || [])
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExpandCase = async (caseId: string) => {
    if (expandedCaseId === caseId) {
      setExpandedCaseId(null)
      return
    }

    setExpandedCaseId(caseId)

    if (!caseProperties[caseId]) {
      setLoadingProperties(prev => ({ ...prev, [caseId]: true }))
      try {
        const res = await fetch(`/api/properties?caseId=${caseId}`)
        const data = await res.json()
        setCaseProperties(prev => ({ ...prev, [caseId]: data || [] }))
      } catch (error) {
        console.error("Failed to load properties:", error)
      } finally {
        setLoadingProperties(prev => ({ ...prev, [caseId]: false }))
      }
    }
  }

  const handleDownloadPDF = (caseId: string) => {
    window.open(`/api/case-pdf?caseId=${caseId}`, "_blank")
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Query
            </label>
            <input
              type="text"
              placeholder="Crime number, year, station, or officer name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
            >
              <option value="ALL">All Cases</option>
              <option value="PENDING">Pending Only</option>
              <option value="DISPOSED">Disposed Only</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e40af] transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("ALL")
              setCases([])
            }}
            className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 shadow-md"
          >
            Clear
          </button>
        </div>
      </form>

      {cases.length > 0 && (
        <div className="bg-white border-2 border-gray-300 mt-6 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#1e3a8a] text-white px-6 py-5">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Search Results
            </h3>
            <p className="text-sm text-blue-200 mt-1">{cases.length} case(s) found</p>
          </div>

          <div className="divide-y divide-gray-200">
            {cases.map((c: any) => (
              <div key={c._id} className="p-6 hover:bg-blue-50 transition-all duration-200">
                <div
                  onClick={() => handleExpandCase(c._id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-xl font-bold text-[#1e3a8a] hover:text-[#1e40af] transition-colors">
                          Crime {c.crimeNumber}/{c.crimeYear}
                        </h4>
                        <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${c.status === "PENDING"
                            ? "bg-[#ffc107] text-[#856404]"
                            : "bg-[#28a745] text-white"
                          }`}>
                          {c.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{c.policeStationName}</span>
                        </div>

                        {c.investigatingOfficer?.name && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>IO: {c.investigatingOfficer.name}</span>
                          </div>
                        )}

                        {c.dateOfFIR && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>FIR: {new Date(c.dateOfFIR).toLocaleDateString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <svg
                      className={`w-6 h-6 text-gray-400 shrink-0 transition-transform duration-300 ${expandedCaseId === c._id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {expandedCaseId === c._id && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-4">
                    {/* Case Details */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
                      <h5 className="font-bold text-[#1e3a8a] mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Case Details
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 font-semibold">Investigating Officer</p>
                          <p className="text-gray-900">{c.investigatingOfficer?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Officer ID</p>
                          <p className="text-gray-900">{c.investigatingOfficer?.officerId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Date of FIR</p>
                          <p className="text-gray-900">{c.dateOfFIR ? new Date(c.dateOfFIR).toLocaleDateString('en-IN') : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Act & Law</p>
                          <p className="text-gray-900">{c.actAndLaw || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Properties */}
                    <div>
                      <h5 className="font-bold text-[#1e3a8a] mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Associated Properties
                      </h5>
                      {loadingProperties[c._id] ? (
                        <p className="text-gray-500 text-sm">Loading properties...</p>
                      ) : caseProperties[c._id]?.length > 0 ? (
                        <div className="space-y-2">
                          {caseProperties[c._id].map((prop: any) => (
                            <div key={prop._id} className="bg-white border-2 border-gray-200 p-3 rounded-lg flex items-center justify-between hover:border-[#1e3a8a] transition-all duration-200">
                              <div>
                                <p className="font-semibold text-gray-900">{prop.category}</p>
                                <p className="text-sm text-gray-600">{prop.nature} - {prop.location}</p>
                              </div>
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${prop.status === "PENDING"
                                  ? "bg-[#ffc107] text-[#856404]"
                                  : "bg-[#28a745] text-white"
                                }`}>
                                {prop.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No properties found</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Link
                        href={`/cases/${c._id}`}
                        className="bg-[#1e3a8a] text-white px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-[#1e40af] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Full Details
                      </Link>
                      <button
                        onClick={() => handleDownloadPDF(c._id)}
                        className="bg-[#28a745] text-white px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-[#218838] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && cases.length === 0 && searchQuery && (
        <div className="bg-white border-2 border-gray-300 p-12 text-center rounded-xl shadow-lg">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 font-semibold mb-2 text-lg">No cases found</p>
          <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}