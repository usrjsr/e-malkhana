"use server"

import dbConnect from "@/lib/db"
import Property from "@/models/Property"

export async function createProperty(data: {
  caseId: string
  category: string
  belongingTo: string
  nature: string
  quantity: string
  unit: string
  location: string
  description: string
  seizureDate: string
  imageUrl: string
}) {
  await dbConnect()

  const propertyData = {
    caseId: data.caseId,
    category: data.category,
    belongingTo: data.belongingTo,
    nature: data.nature,
    quantity: data.quantity,
    location: data.location,
    description: data.description,
    imageUrl: data.imageUrl,
    status: "IN_CUSTODY"
  }

  const qrCodeData = JSON.stringify({
    caseId: data.caseId,
    category: data.category,
    nature: data.nature,
    quantity: data.quantity,
    location: data.location,
    timestamp: new Date().toISOString()
  })

  const property = await Property.create({
    ...propertyData,
    qrCodeData
  })

  return {
    propertyId: property._id.toString()
  }
}
