"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  params: {
    caseId: string
    propertyId: string
  }
}

export default function CustodyPage({ params }: Props) {
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [form, setForm] = useState({
    from: "",
    to: "",
    purpose: "",
    remarks: "",
    timestamp: ""
  })
  const [error, setError] = useState("")

  async function fetchLogs() {
    const res = await fetch(`/api/custody?propertyId=${params.propertyId}`)
    if (res.ok) {
      const data = await res.json()
      setLogs(data)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/custody", {
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
      setError("Failed to add custody entry")
      return
    }

    setForm({
      from: "",
      to: "",
      purpose: "",
      remarks: "",
      timestamp: ""
    })

    fetchLogs()
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Chain of Custody</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
        <input
          name="from"
          placeholder="From Location / Officer"
          value={form.from}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="to"
          placeholder="To Location / Officer"
          value={form.to}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="purpose"
          placeholder="Purpose"
          value={form.purpose}
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

        <input
          type="datetime-local"
          name="timestamp"
          value={form.timestamp}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white py-2 rounded"
        >
          Add Entry
        </button>
      </form>

      <div className="space-y-4">
        {logs.length === 0 && (
          <p className="text-gray-600">No custody records yet</p>
        )}

        {logs.map(log => (
          <div key={log._id} className="border rounded p-4 space-y-1">
            <p><strong>From:</strong> {log.from}</p>
            <p><strong>To:</strong> {log.to}</p>
            <p><strong>Purpose:</strong> {log.purpose}</p>
            <p><strong>Remarks:</strong> {log.remarks}</p>
            <p className="text-sm text-gray-600">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.back()}
        className="border px-4 py-2 rounded"
      >
        Back
      </button>
    </div>
  )
}
