"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function ManageCasesClient() {
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null)
  const [caseProperties, setCaseProperties] = useState<{[key: string]: any[]}>({})
  const [loadingProperties, setLoadingProperties] = useState<{[key: string]: boolean}>({})

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
              className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a] rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a] rounded"
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
            className="bg-[#1e3a8a] text-white px-6 py-2 font-semibold hover:bg-[#1e40af] transition-colors rounded disabled:opacity-50"
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
            className="bg-gray-200 text-gray-700 px-6 py-2 font-semibold hover:bg-gray-300 transition-colors rounded"
          >
            Clear
          </button>
        </div>
      </form>

      {cases.length > 0 && (
        <div className="bg-white border-2 border-gray-300 mt-6">
          <div className="bg-[#1e3a8a] text-white px-6 py-4">
            <h3 className="text-xl font-bold">Search Results</h3>
            <p className="text-sm text-blue-200 mt-1">{cases.length} case(s) found</p>
          </div>

          <div className="divide-y divide-gray-200">
            {cases.map((c: any) => (
              <div key={c._id} className="p-6 hover:bg-[#f8f9fa] transition-colors">
                <div 
                  onClick={() => handleExpandCase(c._id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
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
                      </div>
                    </div>

                    <svg 
                      className={`w-6 h-6 text-gray-400 shrink-0 transition-transform ${expandedCaseId === c._id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>

                {expandedCaseId === c._id && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-4">
                    {/* Case Details */}
                    <div className="bg-[#f8f9fa] p-4 rounded">
                      <h5 className="font-bold text-[#1e3a8a] mb-3">Case Details</h5>
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
                      <h5 className="font-bold text-[#1e3a8a] mb-3">Associated Properties</h5>
                      {loadingProperties[c._id] ? (
                        <p className="text-gray-500">Loading properties...</p>
                      ) : caseProperties[c._id]?.length > 0 ? (
                        <div className="space-y-2">
                          {caseProperties[c._id].map((prop: any) => (
                            <div key={prop._id} className="bg-white border border-gray-300 p-3 rounded flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{prop.category}</p>
                                <p className="text-sm text-gray-600">{prop.nature} - {prop.location}</p>
                              </div>
                              <span className={`px-3 py-1 text-xs font-semibold rounded ${
                                prop.status === "PENDING" 
                                  ? "bg-[#ffc107] text-[#856404]" 
                                  : "bg-[#28a745] text-white"
                              }`}>
                                {prop.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No properties found</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Link
                        href={`/cases/${c._id}`}
                        className="bg-[#1e3a8a] text-white px-4 py-2 text-sm font-semibold hover:bg-[#1e40af] transition-colors rounded"
                      >
                        View Full Details
                      </Link>
                      <button
                        onClick={() => handleDownloadPDF(c._id)}
                        className="bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-colors rounded flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
        <div className="bg-white border-2 border-gray-300 p-12 text-center rounded">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 font-semibold">No cases found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
