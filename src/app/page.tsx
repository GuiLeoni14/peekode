import { auth, signIn, signOut } from "@/auth";
import { CodeEditor } from "./code-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">PeeKode</h1>
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
        <Card className="border shadow-md">
          <CardContent>
            <CodeEditor />
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground flex items-center justify-between">
          {session?.user.username
            ? (
              <Link
                className="flex items-center cursor-pointer"
                href={`/${session?.user.username}`}
              >
                Preview
                <ExternalLink className="mx-2 size-4 dark:invert" />
                peekode.vercel.app/{session?.user.username}
              </Link>
            )
            : <span></span>}
          <p>Feito com ❤️ e Next.js com supabase-realtime</p>
        </div>
      </div>
    </div>
  );
}
