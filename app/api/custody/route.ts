import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import CustodyLog from "@/models/CustodyLog"
import Property from "@/models/Property"
import { verifyToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  await dbConnect()

  const token = req.cookies.get("token")?.value
  const payload = token ? verifyToken(token) : null

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const {
    propertyId,
    from,
    to,
    purpose,
    remarks,
    timestamp
  } = await req.json()

  if (!propertyId || !from || !to || !purpose || !remarks || !timestamp) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const parsedTimestamp = new Date(timestamp)
  if (isNaN(parsedTimestamp.getTime())) {
    return NextResponse.json(
      { error: "Invalid timestamp" },
      { status: 400 }
    )
  }

  const property = await Property.findById(propertyId)
  if (!property || property.status !== "IN_CUSTODY") {
    return NextResponse.json(
      { error: "Property not available" },
      { status: 400 }
    )
  }

  await CustodyLog.create({
    propertyId,
    from,
    to,
    purpose,
    remarks,
    timestamp: parsedTimestamp
  })

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  await dbConnect()

  const token = req.cookies.get("token")?.value
  const payload = token ? verifyToken(token) : null

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const propertyId = searchParams.get("propertyId")

  if (!propertyId) {
    return NextResponse.json(
      { error: "Property ID required" },
      { status: 400 }
    )
  }

  const logs = await CustodyLog
    .find({ propertyId })
    .sort({ timestamp: 1 })

  return NextResponse.json(logs)
}
