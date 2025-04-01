"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useDebounce } from "@/hooks/useDebounce";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface CodeEditorProps {
  initialCode?: string | null;
}
export function CodeEditor({ initialCode }: CodeEditorProps) {
  const [code, setCode] = useState(
    initialCode ?? "// Escreva seu código aqui...",
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
      debouncedCode !== initialCode
    ) {
      setIsSavingCode({
        success: false,
        loading: true,
        error: false,
      });
      fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: debouncedCode,
        }),
      }).then((response) => {
        if (!response.ok) {
          return Promise.reject(new Error(response.statusText));
        }
        setIsSavingCode({
          success: true,
          loading: false,
          error: false,
        });
      }).catch(() => {
        setIsSavingCode({
          success: false,
          loading: false,
          error: true,
        });
      });
    }
  }, [debouncedCode, initialCode]);

  return (
    <div className="w-full">
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
