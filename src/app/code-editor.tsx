"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function CodeEditor() {
  const [code, setCode] = useState("// Escreva seu código aqui...");
  const session = useSession();
  const debouncedCode = useDebounce(code, 1000); // Salva após 1 segundo sem alterações

  useEffect(() => {
    if (debouncedCode && debouncedCode !== "// Escreva seu código aqui...") {
      fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: debouncedCode,
        }),
      }).then(() => {
        toast.success("Salvo com sucesso.");
      }).catch(() => {
        toast.error("Erro ao salvar.");
      });
    }
  }, [debouncedCode]);

  return (
    <div className="w-full">
      <CodeMirror
        value={session.status === "authenticated"
          ? code
          : "// Logue para editar"}
        height="auto"
        extensions={[javascript()]}
        onChange={(value) => setCode(value)}
        editable={session.status === "authenticated"}
        readOnly={session.status !== "authenticated"}
        className="border rounded-lg"
      />
    </div>
  );
}
