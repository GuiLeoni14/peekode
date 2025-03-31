

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { identifier, content } = await req.json();

    if (!identifier || !content) {
      return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    const codeSnippet = await prisma.codeSnippet.upsert({
      where: { identifier },
      update: { content, updatedAt: new Date() },
      create: { identifier, content },
    });

    return NextResponse.json({ success: true, data: codeSnippet }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false }, { status: 500 });
  }
}