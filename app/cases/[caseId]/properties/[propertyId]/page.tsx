import dbConnect from "@/lib/db"
import Property from "@/models/Property"
import Case from "@/models/Case"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: {
    caseId: string
    propertyId: string
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  await dbConnect()

  const property = await Property.findById(params.propertyId)
  if (!property) {
    notFound()
  }

  const caseData = await Case.findById(params.caseId)
  if (!caseData) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Property Details</h1>
        <p className="text-sm text-gray-600">
          Case {caseData.crimeNumber}/{caseData.crimeYear}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p><strong>Category:</strong> {property.category}</p>
          <p><strong>Belonging To:</strong> {property.belongingTo}</p>
          <p><strong>Nature:</strong> {property.nature}</p>
          <p><strong>Quantity:</strong> {property.quantity}</p>
          <p><strong>Location:</strong> {property.location}</p>
          <p><strong>Status:</strong> {property.status}</p>
          <p><strong>Description:</strong> {property.description}</p>
        </div>

        <div className="space-y-4">
          <img
            src={property.imageUrl}
            alt="Property"
            className="border rounded max-h-64 object-cover"
          />

          <div className="border p-4 rounded text-center space-y-2">
            <p className="font-semibold">QR Code</p>
            <img
              src={property.qrCodeData}
              alt="QR Code"
              className="mx-auto"
            />
            <Link
              href={`/properties/${property._id}/qr`}
              className="text-blue-600 underline text-sm"
            >
              Open Printable QR
            </Link>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href={`/cases/${params.caseId}/properties/${params.propertyId}/custody`}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Chain of Custody
        </Link>

        <Link
          href={`/cases/${params.caseId}/properties/${params.propertyId}/disposal`}
          className="border px-4 py-2 rounded"
        >
          Disposal
        </Link>
      </div>
    </div>
  )
}
