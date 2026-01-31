"use server"

import dbConnect from "@/lib/db"
import Case from "@/models/Case"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function createCase(formData: {
  policeStationName: string
  investigatingOfficerName: string
  investigatingOfficerId: string
  crimeNumber: string
  crimeYear: string
  dateOfFIR: string
  dateOfSeizure: string
  actAndLaw: string
  sections: string
}) {
  const token = (await cookies()).get("token")?.value
  if (!token) {
    throw new Error("Unauthorized")
  }

  verifyToken(token)
  await dbConnect()

  const newCase = new Case({
    policeStationName: formData.policeStationName,
    investigatingOfficer: {
      name: formData.investigatingOfficerName,
      officerId: formData.investigatingOfficerId
    },
    crimeNumber: formData.crimeNumber,
    crimeYear: Number(formData.crimeYear),
    dateOfFIR: new Date(formData.dateOfFIR),
    dateOfSeizure: new Date(formData.dateOfSeizure),
    actAndLaw: formData.actAndLaw,
    sections: formData.sections,
    status: "PENDING"
  })

  const savedCase = await newCase.save()
  return { caseId: savedCase._id.toString() }
}
