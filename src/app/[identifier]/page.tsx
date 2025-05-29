import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { CodeHighlighter } from "./code-highlighter";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Credits } from "@/components/credits";
import type { SearchParams } from "next/dist/server/request/search-params";

export async function getCodeByIdentifier(identifier: string) {
  const code = await prisma.codeSnippet.findUnique({
    where: {
      identifier,
    },
    include: {
      codeTabs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return code;
}

interface IdentifierPageProps {
  params: Promise<{
    identifier: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function IdentifierPage(
  { params, ...props }: IdentifierPageProps,
) {
  const { identifier } = await params;
  const searchParams = await props.searchParams;
  const activeTabName = searchParams.tab as string;

  const code = await getCodeByIdentifier(identifier);
  if (!code) {
    notFound();
  }

  const activeTab = code.codeTabs.find((tab) => {
    return tab.name === activeTabName;
  }) ?? code.codeTabs[0];

  if (!activeTab || !activeTab.content) {
    notFound();
  }

  if (activeTab && !activeTabName) {
    return redirect(`/${identifier}?tab=${activeTab.name}`);
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
              tabs={code.codeTabs}
              initialCode={activeTab.content}
              activeTabName={activeTabName}
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
