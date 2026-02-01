"use server";

import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import Disposal from "@/models/Disposal";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function disposeProperty(formData: {
  propertyId: string;
  disposalType: string;
  courtOrderReference: string;
  disposalDate: string;
  remarks: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  await dbConnect();

  const disposal = new Disposal({
    propertyId: formData.propertyId,
    disposalType: formData.disposalType,
    courtOrderReference: formData.courtOrderReference,
    disposalDate: new Date(formData.disposalDate),
    remarks: formData.remarks,
    disposedAt: new Date(),
  });

  await disposal.save();

  await Property.findByIdAndUpdate(formData.propertyId, { status: "DISPOSED" });

  return { success: true };
}
