"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useDebounce } from "@/hooks/useDebounce";

export  function CodeEditor() {
  const [code, setCode] = useState("// Escreva seu código aqui...");
  
  const debouncedCode = useDebounce(code, 1000); // Salva após 1 segundo sem alterações

  useEffect(() => {
    if (debouncedCode) {
      fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: "guileonidev", content: debouncedCode }),
      }).then(() => {
        console.log("Code saved");
      })
    }
  }, [debouncedCode]);
  
  return (
    <div className="w-full">
      <CodeMirror
        value={code}
        height="auto"
        extensions={[javascript()]}
        onChange={(value) => setCode(value)}
        className="border rounded-lg"
      />
    </div>
  );
}
