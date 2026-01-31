import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Property from "@/models/Property"
import { notFound } from "next/navigation"
import Link from "next/link"

type Props = {
  params: Promise<{
    caseId: string
  }>
}

export default async function CaseDetailPage({ params }: Props) {
  const { caseId } = await params

  await dbConnect()

  const caseData = await Case.findById(caseId)
  if (!caseData) {
    notFound()
  }

  const properties = await Property.find({ caseId })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Case {caseData.crimeNumber}/{caseData.crimeYear}
        </h1>
        <p className="text-sm text-gray-600">
          {caseData.policeStationName}
        </p>
      </div>

      <div className="border rounded p-4 space-y-2">
        <p>Investigating Officer: {caseData.investigatingOfficer.name}</p>
        <p>Officer ID: {caseData.investigatingOfficer.officerId}</p>
        <p>Status: {caseData.status}</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Properties</h2>
        <Link
          href={`/cases/${caseId}/properties/new`}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Property
        </Link>
      </div>

      {properties.length === 0 && (
        <p className="text-gray-600">No properties added yet</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((property: any) => (
          <Link
            key={property._id}
            href={`/cases/${caseId}/properties/${property._id}`}
            className="border rounded p-4 hover:bg-gray-50"
          >
            <p className="font-semibold">{property.category}</p>
            <p className="text-sm text-gray-600">{property.nature}</p>
            <p className="text-sm">Status: {property.status}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
