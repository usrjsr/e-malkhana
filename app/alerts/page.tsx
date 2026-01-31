import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Link from "next/link"

export default async function AlertsPage() {
  await dbConnect()

  const now = new Date()
  const threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const cases = await Case.find({
    status: "PENDING",
    createdAt: { $lt: threshold }
  }).sort({ createdAt: 1 })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Long Pending Cases</h1>

      {cases.length === 0 && (
        <p className="text-gray-600">No alerts at the moment</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c: any) => (
          <Link
            key={c._id}
            href={`/cases/${c._id}`}
            className="border rounded p-4 hover:bg-gray-50"
          >
            <p className="font-semibold">
              Crime {c.crimeNumber}/{c.crimeYear}
            </p>
            <p className="text-sm text-gray-600">
              {c.policeStationName}
            </p>
            <p className="text-sm">
              Created: {new Date(c.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
