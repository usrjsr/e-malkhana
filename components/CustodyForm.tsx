"use client"

import { useState } from "react"
import { addCustodyLog } from "@/app/cases/[caseId]/properties/[propertyId]/custody/actions"

export default function CustodyForm({ propertyId, onSuccess }: { propertyId: string; onSuccess: () => void }) {

  const [form, setForm] = useState({
    from: "",
    to: "",
    purpose: "STORAGE",
    remarks: "",
    timestamp: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await addCustodyLog({
        propertyId,
        from: form.from,
        to: form.to,
        purpose: form.purpose,
        remarks: form.remarks,
        timestamp: form.timestamp
      })

      setForm({
        from: "",
        to: "",
        purpose: "STORAGE",
        remarks: "",
        timestamp: ""
      })

      setLoading(false)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add custody entry")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
      <input
        name="from"
        placeholder="From Location / Officer"
        value={form.from}
        onChange={handleChange}
        className="border p-2 rounded"
        required
        disabled={loading}
      />

      <input
        name="to"
        placeholder="To Location / Officer"
        value={form.to}
        onChange={handleChange}
        className="border p-2 rounded"
        required
        disabled={loading}
      />

      <select
        name="purpose"
        value={form.purpose}
        onChange={handleChange}
        className="border p-2 rounded"
        required
        disabled={loading}
      >
        <option value="STORAGE">Storage</option>
        <option value="COURT">Court</option>
        <option value="FSL">FSL</option>
        <option value="ANALYSIS">Analysis</option>
        <option value="TRANSFER">Transfer</option>
      </select>

      <input
        name="remarks"
        placeholder="Remarks"
        value={form.remarks}
        onChange={handleChange}
        className="border p-2 rounded"
        required
        disabled={loading}
      />

      <input
        type="datetime-local"
        name="timestamp"
        value={form.timestamp}
        onChange={handleChange}
        className="border p-2 rounded"
        required
        disabled={loading}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#1e3a8a] text-white py-2 rounded hover:bg-[#1e40af] disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Entry"}
      </button>
    </form>
  )
}
