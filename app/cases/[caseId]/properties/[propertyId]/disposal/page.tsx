"use client"

import Link from "next/link"
import DisposalForm from "@/components/DisposalForm"
import { useParams } from "next/navigation"

export default function DisposalPage() {
  const params = useParams()
  const caseId = params.caseId as string
  const propertyId = params.propertyId as string

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1e3a8a] text-white px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">EP</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">e-Malkhana</h1>
            <p className="text-sm text-blue-200">Digital Evidence Management System</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/cases/${caseId}/properties/${propertyId}`}
            className="text-[#1e3a8a] hover:underline mb-4 inline-block"
          >
            ← Back to Property
          </Link>
          <h1 className="text-3xl font-bold text-[#1e3a8a]">Dispose Property</h1>
          <p className="text-gray-600 mt-2">Mark the property as disposed from custody</p>
        </div>

        <div className="bg-white border-2 border-gray-300 p-6">
          <DisposalForm />
        </div>
      </main>

      <footer className="bg-[#1e3a8a] text-white mt-16 px-4 py-6 text-center text-sm text-blue-200">
        <p>© 2025 Government of India. All rights reserved.</p>
        <p className="mt-2">e-Malkhana - Digital Evidence Management System</p>
      </footer>
    </div>
  )
}
