import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { Logo } from "@/components/logo";
import { Credits } from "@/components/credits";
import { CodeEditorCard, CodeEditorCardFallback } from "./code-editor-card";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
interface HomeProps {
  searchParams: SearchParams;
}
export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const tabName = searchParams.tab;

  const session = await auth();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2 flex flex-col items-center justify-center">
          <Logo />
          <p className="text-muted-foreground">
            Escreva, edite e compartilhe com facilidade
          </p>
        </div>
        {session?.user
          ? (
            <form
              className="flex items-center justify-center gap-2"
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Avatar>
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback>{session.user.name}</AvatarFallback>
              </Avatar>
              <span>Olá, {session.user.name}</span>
              <Button
                className="cursor-pointer px-0 text-base"
                type="submit"
                variant="link"
              >
                Sair?
              </Button>
            </form>
          )
          : (
            <form
              className="flex items-center justify-center"
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <Button
                type="submit"
                className="w-auto cursor-pointer"
                variant="outline"
              >
                <Image
                  src="/assets/github-icon.svg"
                  width={16}
                  height={16}
                  alt=""
                  className="mr-2 size-4 dark:invert"
                />
                Entrar com GitHub
              </Button>
            </form>
          )}
        {!session?.user
          ? (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground text-sm">
                  Você precisa estar logado para editar seu código.
                </p>
                <p className="text-sm mt-2">
                  Conecte-se com o GitHub para salvar, editar e compartilhar
                  seus projetos.
                </p>
              </CardContent>
            </Card>
          )
          : (
            <Suspense fallback={<CodeEditorCardFallback />}>
              <CodeEditorCard activeTabName={tabName} />
            </Suspense>
          )}
        <div className="text-center text-sm text-muted-foreground flex items-center justify-between">
          {session?.user.username
            ? (
              <a
                className="flex items-center cursor-pointer"
                href={tabName
                  ? `/${session?.user.username}?tab=${tabName}`
                  : `/${session?.user.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview
                <ExternalLink className="mx-2 size-4 dark:invert" />
                {tabName
                  ? (
                    <>
                      peekode.vercel.app/{session?.user.username}?tab={tabName}
                    </>
                  )
                  : (
                    <>
                      peekode.vercel.app/{session?.user.username}
                    </>
                  )}
              </a>
            )
            : <span></span>}
          <Credits />
        </div>
      </div>
    </div>
  );
}
