"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadButton } from "@/utils/uploadthing"

type Props = {
  params: {
    caseId: string
  }
}

export default function NewPropertyPage({ params }: Props) {
  const router = useRouter()

  const [form, setForm] = useState({
    category: "",
    belongingTo: "UNKNOWN",
    nature: "",
    quantity: "",
    location: "",
    description: ""
  })

  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        caseId: params.caseId,
        imageUrl
      })
    })

    if (!res.ok) {
      setError("Failed to add property")
      return
    }

    const data = await res.json()
    router.push(`/cases/${params.caseId}/properties/${data.propertyId}`)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Add Property</h1>

      <UploadButton
        endpoint="propertyImage"
        onClientUploadComplete={(res: { url: string }[]) => {
            setImageUrl(res[0].url)
        }}
        onUploadError={() => {
            setError("Image upload failed")
        }}
        />


      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          name="category"
          placeholder="Category of Property"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="belongingTo"
          value={form.belongingTo}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="ACCUSED">Accused</option>
          <option value="COMPLAINANT">Complainant</option>
          <option value="UNKNOWN">Unknown</option>
        </select>

        <input
          name="nature"
          placeholder="Nature of Property"
          value={form.nature}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="quantity"
          placeholder="Quantity / Units"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="location"
          placeholder="Location (Rack / Room / Locker)"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="description"
          placeholder="Property Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white py-2 rounded"
          disabled={!imageUrl}
        >
          Save Property
        </button>
      </form>
    </div>
  )
}
