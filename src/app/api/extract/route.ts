import { NextRequest, NextResponse } from "next/server";

const KREUZBERG_URL = process.env.KREUZBERG_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    // Forward to Kreuzberg API
    const kreuzbergForm = new FormData();
    kreuzbergForm.append("files", file);
    kreuzbergForm.append("output_format", "markdown");

    const response = await fetch(`${KREUZBERG_URL}/extract`, {
      method: "POST",
      body: kreuzbergForm,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Kreuzberg error:", errorText);
      return NextResponse.json(
        { error: `Extraction failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // Kreuzberg returns an array of results (one per file)
    // Each result has: content, metadata, etc.
    const markdown = result[0]?.content || result[0]?.text || "";

    return NextResponse.json({ markdown, filename: file.name });
  } catch (error) {
    console.error("Extract error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
