import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import { verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  await dbConnect()

  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  verifyToken(token)

  const now = new Date()
  const threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const cases = await Case.find({
    status: "PENDING",
    createdAt: { $lt: threshold }
  }).sort({ createdAt: 1 })

  return NextResponse.json(cases)
}
