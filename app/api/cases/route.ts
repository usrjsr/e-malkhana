import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Case from "@/models/Case";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();
  const statusFilter = searchParams.get("status");

  const filter: any = {};

  if (query) {
    const year = Number(query);

    filter.$or = [
      { crimeNumber: { $regex: query, $options: "i" } },
      { policeStationName: { $regex: query, $options: "i" } },
      { "investigatingOfficer.name": { $regex: query, $options: "i" } },
      ...(isNaN(year) ? [] : [{ crimeYear: year }]),
    ];
  }

  if (statusFilter && statusFilter !== "ALL") {
    filter.status = statusFilter;
  }

  const cases = await Case.find(filter).sort({ createdAt: -1 }).limit(20);

  return NextResponse.json(cases);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const body = await req.json();

  const {
    policeStationName,
    investigatingOfficerName,
    investigatingOfficerId,
    crimeNumber,
    crimeYear,
    dateOfFIR,
    dateOfSeizure,
    actAndLaw,
    sections,
  } = body;

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
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const newCase = await Case.create({
    policeStationName,
    investigatingOfficer: {
      name: investigatingOfficerName,
      officerId: investigatingOfficerId,
    },
    crimeNumber,
    crimeYear,
    dateOfFIR: new Date(dateOfFIR),
    dateOfSeizure: new Date(dateOfSeizure),
    actAndLaw,
    sections,
  });

  return NextResponse.json({ caseId: newCase._id });
}
