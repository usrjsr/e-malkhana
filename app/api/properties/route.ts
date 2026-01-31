import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Property from "@/models/Property"
import Case from "@/models/Case"
import { verifyToken } from "@/lib/auth"
import QRCode from "qrcode"

export async function POST(req: NextRequest) {
  await dbConnect()

  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  verifyToken(token)

  const body = await req.json()

  const {
    caseId,
    category,
    belongingTo,
    nature,
    quantity,
    location,
    description,
    imageUrl
  } = body

  if (
    !caseId ||
    !category ||
    !belongingTo ||
    !nature ||
    !quantity ||
    !location ||
    !description ||
    !imageUrl
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const caseExists = await Case.findById(caseId)
  if (!caseExists) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 })
  }

  const qrData = `PROPERTY:${caseId}:${Date.now()}`
  const qrCodeData = await QRCode.toDataURL(qrData)

  const property = await Property.create({
    caseId,
    category,
    belongingTo,
    nature,
    quantity,
    location,
    description,
    imageUrl,
    qrCodeData
  })

  return NextResponse.json({ propertyId: property._id })
}
