import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await dbConnect()

  const body = await req.json()

  const {
    policeStationName,
    investigatingOfficerName,
    investigatingOfficerId,
    crimeNumber,
    crimeYear,
    dateOfFIR,
    dateOfSeizure,
    actAndLaw,
    sections
  } = body

  if (
    !policeStationName ||
    !investigatingOfficerName ||
    !investigatingOfficerId ||
    !crimeNumber ||
    !crimeYear ||
    !dateOfFIR ||
    !dateOfSeizure ||
    !actAndLaw ||
    !sections
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const newCase = await Case.create({
    policeStationName,
    investigatingOfficer: {
      name: investigatingOfficerName,
      officerId: investigatingOfficerId
    },
    crimeNumber,
    crimeYear,
    dateOfFIR,
    dateOfSeizure,
    actAndLaw,
    sections
  })

  return NextResponse.json({ caseId: newCase._id })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await dbConnect()

  const cases = await Case.find().sort({ createdAt: -1 })
  return NextResponse.json(cases)
}
