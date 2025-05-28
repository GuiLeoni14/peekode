import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user.username) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { tabName, content } = await req.json();

    if (!tabName || typeof tabName !== "string") {
      return NextResponse.json({ success: false, error: "Nome da aba obrigatório" }, { status: 400 });
    }

    const codeSnippet = await prisma.codeSnippet.upsert({
      where: { identifier: session.user.username },
      update: { updatedAt: new Date() },
      create: { identifier: session.user.username },
    });

    const existingTab = await prisma.codeTab.findFirst({
      where: {
        codeSnippetId: codeSnippet.id,
        name: tabName,
      },
    });

    if (existingTab) {
      const updatedTab = await prisma.codeTab.update({
        where: { id: existingTab.id },
        data: {
          content,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, data: updatedTab }, { status: 200 });
    } else {
      // Cria uma nova aba
      const newTab = await prisma.codeTab.create({
        data: {
          name: tabName,
          content,
          codeSnippetId: codeSnippet.id,
        },
      });
      return NextResponse.json({ success: true, data: newTab }, { status: 201 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
