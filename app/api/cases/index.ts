import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import { verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    verifyToken(token)

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.trim()
    const statusFilter = searchParams.get("status")

    let filter: any = {}

    if (query) {
      filter.$or = [
        { crimeNumber: { $regex: query, $options: "i" } },
        { crimeYear: Number(query) || -1 },
        { policeStationName: { $regex: query, $options: "i" } },
        { "investigatingOfficer.name": { $regex: query, $options: "i" } }
      ]
    }

    if (statusFilter && statusFilter !== "ALL") {
      filter.status = statusFilter
    }

    const cases = await Case.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)

    return NextResponse.json(cases)
  } catch (error) {
    console.error("Cases search error:", error)
    return NextResponse.json(
      { error: "Failed to search cases" },
      { status: 500 }
    )
  }
}
