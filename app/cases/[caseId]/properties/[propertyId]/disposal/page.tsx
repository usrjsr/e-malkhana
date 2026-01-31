"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  params: {
    caseId: string
    propertyId: string
  }
}

export default function DisposalPage({ params }: Props) {
  const router = useRouter()

  const [form, setForm] = useState({
    disposalType: "RETURNED",
    courtOrderReference: "",
    disposalDate: "",
    remarks: ""
  })

  const [error, setError] = useState("")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/disposal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        propertyId: params.propertyId
      })
    })

    if (!res.ok) {
      setError("Disposal failed")
      return
    }

    router.push(`/cases/${params.caseId}`)
  }

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Dispose Property</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <select
          name="disposalType"
          value={form.disposalType}
          onChange={handleChange}
          className="border p-2 rounded"
        >
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

        <input
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white py-2 rounded"
        >
          Confirm Disposal
        </button>
      </form>

      <button
        onClick={() => router.back()}
        className="border px-4 py-2 rounded"
      >
        Back
      </button>
    </div>
  )
}
