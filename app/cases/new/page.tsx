"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewCasePage() {
  const router = useRouter()

  const [form, setForm] = useState({
    policeStationName: "",
    investigatingOfficerName: "",
    investigatingOfficerId: "",
    crimeNumber: "",
    crimeYear: "",
    dateOfFIR: "",
    dateOfSeizure: "",
    actAndLaw: "",
    sections: ""
  })

  const [error, setError] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })

    if (!res.ok) {
      setError("Failed to create case")
      return
    }

    const data = await res.json()
    router.push(`/cases/${data.caseId}`)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">New Case</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          name="policeStationName"
          placeholder="Police Station Name"
          value={form.policeStationName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="investigatingOfficerName"
          placeholder="Investigating Officer Name"
          value={form.investigatingOfficerName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="investigatingOfficerId"
          placeholder="Investigating Officer ID"
          value={form.investigatingOfficerId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="crimeNumber"
          placeholder="Crime Number"
          value={form.crimeNumber}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="crimeYear"
          placeholder="Crime Year"
          value={form.crimeYear}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          name="dateOfFIR"
          value={form.dateOfFIR}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          name="dateOfSeizure"
          value={form.dateOfSeizure}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="actAndLaw"
          placeholder="Act & Law"
          value={form.actAndLaw}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="sections"
          placeholder="Sections of Law"
          value={form.sections}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white py-2 rounded"
        >
          Create Case
        </button>
      </form>
    </div>
  )
}
