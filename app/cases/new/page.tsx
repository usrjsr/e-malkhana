"use client"

import Link from "next/link"
import CaseForm from "@/components/CaseForm"

export default function NewCasePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#f8f9fa] border-b border-gray-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1e3a8a]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/dashboard" className="hover:text-[#1e3a8a]">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1e3a8a] font-semibold">New Case</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#1e3a8a]">Register New Case</h2>
            <p className="text-gray-600 mt-2">Fill in the case details to create a new entry in the system</p>
          </div>

          <CaseForm />
        </div>
      </div>
    </div>
  )
}