import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import Link from "next/link"

export default async function DashboardPage() {
  await dbConnect()

  const totalCases = await Case.countDocuments({})
  const pendingCases = await Case.countDocuments({ status: "PENDING" })
  const disposedCases = await Case.countDocuments({ status: "DISPOSED" })

  const now = new Date()
  const threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const alertCases = await Case.countDocuments({
    status: "PENDING",
    createdAt: { $lt: threshold }
  })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-600">Total Cases</p>
          <p className="text-2xl font-bold">{totalCases}</p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-600">Pending Cases</p>
          <p className="text-2xl font-bold">{pendingCases}</p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-600">Disposed Cases</p>
          <p className="text-2xl font-bold">{disposedCases}</p>
        </div>

        <Link
          href="/alerts"
          className="border rounded p-4 hover:bg-gray-50"
        >
          <p className="text-sm text-gray-600">Alerts</p>
          <p className="text-2xl font-bold">{alertCases}</p>
        </Link>
      </div>
    </div>
  )
}
