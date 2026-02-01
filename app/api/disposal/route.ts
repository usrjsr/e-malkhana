import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Disposal from "@/models/Disposal";
import Property from "@/models/Property";
import Case from "@/models/Case";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const {
    propertyId,
    disposalType,
    courtOrderReference,
    disposalDate,
    remarks,
  } = await req.json();

  console.log({
    propertyId,
    disposalType,
    courtOrderReference,
    disposalDate,
    remarks,
  });

  if (
    !propertyId ||
    !disposalType ||
    !courtOrderReference ||
    !disposalDate ||
    !remarks
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const parsedDate = new Date(disposalDate);
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json(
      { error: "Invalid disposal date" },
      { status: 400 },
    );
  }

  const property = await Property.findById(propertyId);
  if (!property || property.status === "DISPOSED") {
    return NextResponse.json({ error: "Invalid property" }, { status: 400 });
  }

  await Disposal.create({
    propertyId,
    disposalType,
    courtOrderReference,
    disposalDate: parsedDate,
    remarks,
  });

  property.status = "DISPOSED";
  await property.save();

  const remaining = await Property.countDocuments({
    caseId: property.caseId,
    status: "IN_CUSTODY",
  });

  if (remaining === 0) {
    await Case.findByIdAndUpdate(property.caseId, { status: "DISPOSED" });
  }

  return NextResponse.json({ success: true });
}
