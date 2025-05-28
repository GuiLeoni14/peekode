"use client";

import { startTransition, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useDebounce } from "@/hooks/useDebounce";
import { useSession } from "next-auth/react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { CodeTab } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { editCodeTabAction } from "./actions";

interface CodeEditorProps {
  tab: CodeTab;
}
export function CodeEditor({ tab }: CodeEditorProps) {
  const [code, setCode] = useState(
    tab.content ?? "// Escreva seu código aqui...",
  );
  const [isSavingCode, setIsSavingCode] = useState<
    undefined | {
      success: boolean;
      loading: boolean;
      error: boolean;
    }
  >(
    undefined,
  );
  const session = useSession();
  const debouncedCode = useDebounce(code, 600); // Salva após 1 segundo sem alterações

  useEffect(() => {
    if (
      debouncedCode !== "// Escreva seu código aqui..." &&
      debouncedCode !== tab.content
    ) {
      setIsSavingCode({
        success: false,
        loading: true,
        error: false,
      });
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("tabId", tab.id);
          formData.append("content", debouncedCode);
          await editCodeTabAction(formData);
          setIsSavingCode({
            success: true,
            loading: false,
            error: false,
          });
        } catch {
          setIsSavingCode({
            success: false,
            loading: false,
            error: true,
          });
        }
      });
    }
  }, [debouncedCode, tab]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {typeof isSavingCode !== "undefined"
          ? (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              {isSavingCode.loading && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                </>
              )}
              {isSavingCode.success && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Salvo
                </>
              )}
              {isSavingCode.error && (
                <>
                  <XCircle className="w-4 h-4 text-red-500" /> Erro
                </>
              )}
            </span>
          )
          : (
            <span className="text-sm text-muted-foreground">
              Comece a editar
            </span>
          )}
        <Link href="/" className="ml-auto">
          <Button variant="link" size="sm">Trocar de tab?</Button>
        </Link>
      </div>
      <CodeMirror
        value={session.status === "authenticated"
          ? code
          : "// Logue para editar"}
        height="auto"
        extensions={[javascript()]}
        onChange={(value) => setCode(value)}
        editable={session.status === "authenticated"}
        readOnly={session.status !== "authenticated"}
        className="border rounded-lg mt-2 max-h-[60vh] overflow-auto"
      />
    </div>
  );
}
