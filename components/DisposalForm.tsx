"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { disposeProperty } from "@/app/cases/[caseId]/properties/[propertyId]/disposal/actions"

export default function DisposalForm() {
  const router = useRouter()
  const params = useParams()

  const caseId = params.caseId as string
  const propertyId = params.propertyId as string

  const [form, setForm] = useState({
    disposalType: "",
    courtOrderReference: "",
    disposalDate: "",
    remarks: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const d = new Date(form.disposalDate)
    if (isNaN(d.getTime())) {
      setError("Invalid disposal date")
      setLoading(false)
      return
    }

    try {
      await disposeProperty({
        propertyId,
        disposalType: form.disposalType,
        courtOrderReference: form.courtOrderReference,
        disposalDate: form.disposalDate,
        remarks: form.remarks
      })
      router.replace(`/cases/${caseId}/properties/${propertyId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to dispose property")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <select
        name="disposalType"
        value={form.disposalType}
        onChange={handleChange}
        className="border p-2 rounded"
        required
        disabled={loading}
      >
        <option value="">Select Disposal Type</option>
        <option value="RETURNED">Returned</option>
        <option value="DESTROYED">Destroyed</option>
        <option value="AUCTIONED">Auctioned</option>
        <option value="COURT_CUSTODY">Court Custody</option>
      </select>

      <input
        name="courtOrderReference"
        type="text"
        placeholder="Court Order Reference"
        value={form.courtOrderReference}
        onChange={handleChange}
        className="border p-2 rounded"
        required
        disabled={loading}
      />

      <input
        name="disposalDate"
        type="date"
        value={form.disposalDate}
        onChange={handleChange}
        className="border p-2 rounded"
        required
        disabled={loading}
      />

      <textarea
        name="remarks"
        placeholder="Remarks (optional)"
        value={form.remarks}
        onChange={handleChange}
        rows={3}
        className="border p-2 rounded resize-none"
        disabled={loading}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#1e3a8a] text-white py-2 rounded hover:bg-[#1e40af] disabled:opacity-50"
        >
          {loading ? "Processing..." : "Dispose Property"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
