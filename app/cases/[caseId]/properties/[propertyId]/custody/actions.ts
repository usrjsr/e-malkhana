"use server"

import dbConnect from "@/lib/db"
import CustodyLog from "@/models/CustodyLog"
import Property from "@/models/Property"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function addCustodyLog(formData: {
  propertyId: string
  from: string
  to: string
  purpose: string
  remarks: string
  timestamp: string
}) {
  const token = (await cookies()).get("token")?.value
  if (!token) {
    throw new Error("Unauthorized")
  }

  verifyToken(token)
  await dbConnect()

  const property = await Property.findById(formData.propertyId)
  if (!property) {
    throw new Error("Property not found")
  }

  if (property.status === "DISPOSED") {
    throw new Error("Cannot add custody log to disposed property")
  }

  const custody = new CustodyLog({
    propertyId: formData.propertyId,
    from: formData.from,
    to: formData.to,
    purpose: formData.purpose,
    remarks: formData.remarks,
    timestamp: new Date(formData.timestamp)
  })

  await custody.save()
  return { success: true }
}
