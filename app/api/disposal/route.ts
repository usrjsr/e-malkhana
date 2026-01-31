import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Disposal from "@/models/Disposal"
import Property from "@/models/Property"
import Case from "@/models/Case"
import { verifyToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  await dbConnect()

  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()

  const {
    propertyId,
    disposalType,
    courtOrderReference,
    disposalDate,
    remarks
  } = body

  if (
    !propertyId ||
    !disposalType ||
    !courtOrderReference ||
    !disposalDate ||
    !remarks
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const property = await Property.findById(propertyId)
  if (!property || property.status === "DISPOSED") {
    return NextResponse.json({ error: "Invalid property" }, { status: 400 })
  }

  await Disposal.create({
    propertyId,
    disposalType,
    courtOrderReference,
    disposalDate,
    remarks
  })

  property.status = "DISPOSED"
  await property.save()

  const remaining = await Property.countDocuments({
    caseId: property.caseId,
    status: "IN_CUSTODY"
  })

  if (remaining === 0) {
    await Case.findByIdAndUpdate(property.caseId, {
      status: "DISPOSED"
    })
  }

  return NextResponse.json({ success: true })
}
