

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth()

    if(!session?.user.username){
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { content } = await req.json();
    
    if (!content) {
      return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    const codeSnippet = await prisma.codeSnippet.upsert({
      where: { identifier: session.user.username },
      update: { content, updatedAt: new Date() },
      create: { identifier: session.user.username, content },
    });

    return NextResponse.json({ success: true, data: codeSnippet }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false }, { status: 500 });
  }
}