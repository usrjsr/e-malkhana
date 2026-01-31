import dbConnect from "@/lib/db"
import Case from "@/models/Case"

export default async function DashboardPage() {
  await dbConnect()

  const totalCases = await Case.countDocuments({})
  const pendingCases = await Case.countDocuments({ status: "PENDING" })
  const disposedCases = await Case.countDocuments({ status: "DISPOSED" })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  )
}
