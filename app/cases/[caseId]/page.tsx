import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Property from "@/models/Property"
import CustodyLog from "@/models/CustodyLog"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import CasePrintClient from "../manage/case-print-client"

type Props = {
  params: Promise<{
    caseId: string
  }>
}

export default async function CaseDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const { caseId } = await params

  await dbConnect()

  const caseData = await Case.findById(caseId)
  if (!caseData) {
    notFound()
  }

  const properties = await Property.find({ caseId })

  const logs = await CustodyLog.find({
    propertyId: { $in: properties.map(p => p._id) }
  }).sort({ timestamp: -1 })

  const lastLogByProperty = logs.reduce((acc: any, log: any) => {
    const key = log.propertyId.toString()
    if (!acc[key]) acc[key] = log
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1e3a8a]">
            Case {caseData.crimeNumber}/{caseData.crimeYear}
          </h2>
          <p className="text-gray-600 mt-1">{caseData.policeStationName}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm font-semibold ${
              caseData.status === "DISPOSED"
                ? "bg-green-600 text-white"
                : "bg-yellow-400 text-yellow-900"
            }`}
          >
            {caseData.status}
          </span>
        </div>
        <CasePrintClient />
        <Link
          href="/dashboard"
          className="border px-6 py-2 font-semibold"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="mb-8 border p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Investigating Officer</p>
          <p>{caseData.investigatingOfficer.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Officer ID</p>
          <p>{caseData.investigatingOfficer.officerId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date of FIR</p>
          <p>{caseData.dateOfFIR ? new Date(caseData.dateOfFIR).toLocaleDateString("en-IN") : "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date of Seizure</p>
          <p>{caseData.dateOfSeizure ? new Date(caseData.dateOfSeizure).toLocaleDateString("en-IN") : "N/A"}</p>
        </div>
      </div>

      <div className="border mb-6">
        <div className="flex justify-between items-center bg-[#1e3a8a] text-white px-6 py-4">
          <h3 className="text-xl font-bold">Seized Properties</h3>
          <Link
            href={`/cases/${caseId}/properties/new`}
            className="bg-white text-[#1e3a8a] px-4 py-2 font-semibold"
          >
            + Add Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No properties added yet
          </div>
        ) : (
          <div className="divide-y">
            {properties.map((p: any) => {
              const last = lastLogByProperty[p._id.toString()]

              return (
                <div key={p._id} className="p-6 flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{p.category}</p>
                    <p className="text-sm text-gray-600">
                      {p.nature} | {p.location}
                    </p>
                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span className={p.status === "DISPOSED" ? "text-green-600" : "text-yellow-700"}>
                        {p.status}
                      </span>
                    </p>

                    <p className="text-sm text-gray-700 mt-2">
                      {last
                        ? `Last movement: ${last.from} → ${last.to} (${last.purpose})`
                        : "No custody movement yet"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/cases/${caseId}/properties/${p._id}`}
                      className="border px-4 py-2 text-sm text-center"
                    >
                      View Property
                    </Link>

                    <Link
                      href={`/cases/${caseId}/properties/${p._id}/custody`}
                      className="border px-4 py-2 text-sm text-center"
                    >
                      Custody Log
                    </Link>

                    {(session.user as any).role === "ADMIN" && p.status !== "DISPOSED" && (
                      <Link
                        href={`/cases/${caseId}/properties/${p._id}/disposal`}
                        className="border px-4 py-2 text-sm text-center text-red-600"
                      >
                        Dispose
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
