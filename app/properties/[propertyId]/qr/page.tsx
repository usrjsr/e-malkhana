import dbConnect from "@/lib/db"
import Property from "@/models/Property"
import { notFound } from "next/navigation"

type Props = {
  params: {
    propertyId: string
  }
}

export default async function PropertyQRPage({ params }: Props) {
  await dbConnect()

  const property = await Property.findById(params.propertyId)
  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-xl font-semibold">Property QR Code</h1>

      <img
        src={property.qrCodeData}
        alt="QR Code"
        className="w-64 h-64"
      />

      <div className="text-center space-y-1">
        <p><strong>Category:</strong> {property.category}</p>
        <p><strong>Nature:</strong> {property.nature}</p>
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>Status:</strong> {property.status}</p>
      </div>

      <button
        onClick={() => globalThis.print()}
        className="border px-4 py-2 rounded"
      >
        Print
      </button>
    </div>
  )
}
