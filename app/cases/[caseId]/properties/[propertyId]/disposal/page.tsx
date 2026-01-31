"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function DisposalPage() {
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
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

    const res = await fetch("/api/disposal", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        propertyId,
        ...form
      })
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to dispose property")
      setLoading(false)
      return
    }

    router.push(`/cases/${caseId}/properties/${propertyId}`)
  }

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Dispose Property</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <select
          name="disposalType"
          value={form.disposalType}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Disposal Type</option>
          <option value="RETURNED">Returned</option>
          <option value="DESTROYED">Destroyed</option>
          <option value="AUCTIONED">Auctioned</option>
          <option value="COURT_CUSTODY">Court Custody</option>
        </select>

        <input
          name="courtOrderReference"
          placeholder="Court Order Reference"
          value={form.courtOrderReference}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          name="disposalDate"
          value={form.disposalDate}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
          className="border p-2 rounded"
          rows={3}
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Confirm Disposal"}
          </button>

          <Link
            href={`/cases/${caseId}/properties/${propertyId}`}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
