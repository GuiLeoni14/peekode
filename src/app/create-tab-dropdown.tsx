"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFormState } from "@/hooks/use-form-state";
import { type ReactNode, useState } from "react";
import { createCodeTabAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface CreateTabDropdownProps {
  children: ReactNode;
}
export function CreateTabDropdown({ children }: CreateTabDropdownProps) {
  const router = useRouter();
  const session = useSession();

  const [tabName, setTabName] = useState("minha-tab");

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    createCodeTabAction,
    () => {
      if (session.data?.user) {
        router.push(`/?tab=${tabName}`);
      }
    },
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Digite o nome</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form onSubmit={handleSubmit}>
          <div className="w-full relative">
            <Input
              name="tabName"
              defaultValue="minha-tab"
              onChange={(e) => setTabName(e.target.value)}
            />
            <Button
              className="absolute right-0 top-1/2 -translate-y-1/2"
              type="submit"
              size="sm"
              variant="ghost"
            >
              Criar
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
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> {message}
                </>
              )}
              {!isPending && errors?.tabName && (
                <>
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />{" "}
                  {errors.tabName[0] ?? "Erro"}
                </>
              )}  
              {!isPending && message && !success && (
                <>
                  <XCircle className="w-4 h-4 text-red-500" /> {message}
                </>
              )}
            </span>
          }
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
