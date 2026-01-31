import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Property from "@/models/Property"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import ManageCasesClient from "./case-print-client"

export default async function ManageCasesPage() {
  const token = (await cookies()).get("token")?.value
  const payload = token ? verifyToken(token) : null

  if (!payload) {
    redirect("/login")
  }

  await dbConnect()

  const cases = await Case.find().sort({ createdAt: -1 })
  const properties = await Property.find()

  const caseData = cases.map((caseItem: any) => {
    const caseProperties = properties.filter(
      (p: any) => p.caseId.toString() === caseItem._id.toString()
    )
    return {
      ...caseItem.toObject(),
      totalProperties: caseProperties.length,
      pendingProperties: caseProperties.filter((p: any) => p.status === "PENDING").length,
      disposedProperties: caseProperties.filter((p: any) => p.status === "DISPOSED").length
    }
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#1e3a8a]">Manage Entries</h2>
          <p className="text-gray-600 mt-2">Search cases, view details, properties, and print information</p>
        </div>

        <ManageCasesClient />
      </div>
    </div>
  )
}

