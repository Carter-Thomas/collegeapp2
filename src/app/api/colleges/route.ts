import { NextRequest, NextResponse } from "next/server";
import { searchColleges } from "@/lib";
import { SearchParams } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const params: SearchParams = await req.json();
    const results = await searchColleges(params);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch college data" },
      { status: 500 },
    );
  }
}
