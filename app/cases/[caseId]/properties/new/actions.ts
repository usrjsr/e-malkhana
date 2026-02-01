"use server";

import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import QRCode from "qrcode";

export async function createProperty(data: {
  caseId: string;
  category: string;
  belongingTo: string;
  nature: string;
  quantity: string;
  unit: string;
  location: string;
  description: string;
  seizureDate: string;
  imageUrl: string;
}) {
  await dbConnect();

  const property = await Property.create({
    caseId: data.caseId,
    category: data.category,
    belongingTo: data.belongingTo,
    nature: data.nature,
    quantity: data.quantity,
    location: data.location,
    description: data.description,
    imageUrl: data.imageUrl,
    status: "IN_CUSTODY",
    qrCodeData: "TEMP",
  });

  const qrUrl = `${process.env.NEXTAUTH_URL}/properties/${property._id}/qr`;

  const qrCodeData = await QRCode.toDataURL(qrUrl);

  property.qrCodeData = qrCodeData;
  await property.save();

  return {
    propertyId: property._id.toString(),
  };
}
