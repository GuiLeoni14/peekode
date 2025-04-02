import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CodeHighlighter } from "./code-highlighter";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Credits } from "@/components/credits";

export async function getCodeByIdentifier(identifier: string) {
  const code = await prisma.codeSnippet.findUnique({
    where: {
      identifier,
    },
  });

  return code;
}

interface IdentifierPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export default async function IdentifierPage({ params }: IdentifierPageProps) {
  const { identifier } = await params;
  const code = await getCodeByIdentifier(identifier);
  if (!code) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2 flex flex-col items-center justify-cente">
          <Logo />
          <p className="text-muted-foreground">
            Veja, copie e cole com facilidade
          </p>
        </div>

        <Card className="border shadow-md">
          <CardContent>
            <CodeHighlighter
              initialCode={code.content}
              identifier={identifier}
            />
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground flex items-center justify-between">
          <span>
            Visualizando <strong>{code.identifier}</strong>
          </span>
          <Credits />
        </div>
      </div>
    </div>
  );
}
