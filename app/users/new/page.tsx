"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewUserPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "USER",
    officerId: "",
    policeStation: ""
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

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })

    if (!res.ok) {
      setError("Failed to create user")
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Create User</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="USER">Officer</option>
          <option value="ADMIN">Admin</option>
        </select>

        <input
          name="officerId"
          placeholder="Officer ID"
          value={form.officerId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="policeStation"
          placeholder="Police Station"
          value={form.policeStation}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white py-2 rounded"
        >
          Create User
        </button>
      </form>
    </div>
  )
}