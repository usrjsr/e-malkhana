"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import CustodyForm from "@/components/CustodyForm"
import CustodyLogsList from "@/components/CustodyLogsList"

export default function CustodyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.propertyId as string

  const [logs, setLogs] = useState<any[]>([])

  async function fetchLogs() {
    const res = await fetch(`/api/custody?propertyId=${propertyId}`, {
      credentials: "include"
    })

    if (res.ok) {
      const data = await res.json()
      setLogs(data)
    }
  }

  useEffect(() => {
    if (propertyId) {
      fetchLogs()
    }
  }, [propertyId])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Chain of Custody</h1>

      <CustodyForm propertyId={propertyId} onSuccess={fetchLogs} />

      <CustodyLogsList logs={logs} />

      <button
        onClick={() => router.back()}
        className="border px-4 py-2 rounded"
      >
        Back
      </button>
    </div>
  )
}
