"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormState } from "@/hooks/use-form-state";
import type { CodeTab } from "@prisma/client";
import { deleteCodeTabAction, editCodeTabAction } from "./actions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, Loader2, Trash, XCircle } from "lucide-react";
import Link from "next/link";

interface TabCardProps {
  tab: CodeTab;
}
export function TabCard({ tab }: TabCardProps) {
  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    editCodeTabAction,
  );

  const [{}, handleDelete] = useFormState(deleteCodeTabAction, () => {
    window.location.reload();
  });

  return (
    <Card className="border shadow-md" key={tab.id}>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <form onSubmit={handleSubmit}>
            <Input name="tabId" hidden defaultValue={tab.id} />
            <div className="w-full relative">
              <Input name="tabName" defaultValue={tab.name} />
              <Button
                className="absolute right-0 top-1/2 -translate-y-1/2"
                type="submit"
                size="icon"
                variant="ghost"
              >
                <Edit />
              </Button>
            </div>
            {
              <span className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                {isPending && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                  </>
                )}
                {!isPending && success && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />{" "}
                    {message}
                  </>
                )}
                {!isPending && errors?.tabName && (
                  <>
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />{" "}
                    {errors.tabName[0] ?? "Erro"}
                  </>
                )}
                {!isPending && errors && message && (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" /> {message}
                  </>
                )}
              </span>
            }
          </form>
          <p className="text-xs text-muted-foreground">
            Criado em: {new Date(tab.createdAt).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            Atualizado em: {new Date(tab.updatedAt).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="text-sm">
          {tab.content
            ? (
              <pre className="bg-gray-100 p-2 rounded max-h-[120px] overflow-hidden text-xs truncate whitespace-nowrap">
                {tab.content}
              </pre>
            )
            : (
              <div className="w-full h-[32px] bg-gray-200 rounded animate-pulse" />
            )}
        </div>
        <div className="flex gap-2 items-center">
          <Link href={`/?tab=${tab.name}`}>
            <Button variant="outline" size="sm">Editar código</Button>
          </Link>
          <form onSubmit={handleDelete}>
            <Input name="tabId" hidden defaultValue={tab.id} />
            <Button variant="outline" size="sm">
              <Trash />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
