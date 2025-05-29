"use client";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import type { CodeTab } from "@prisma/client";

interface CodeHighlighterProps {
  identifier: string;
  activeTabName: string;
  tabs: CodeTab[];
  initialCode: string | null;
}
export function CodeHighlighter(
  { initialCode, identifier, tabs, activeTabName }: CodeHighlighterProps,
) {
  const [actualCode, setActualCode] = useState(initialCode ?? "");

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(actualCode);
      toast.success("Código copiado!", {
        description: "Agora você pode colá-lo onde quiser.",
      });
    } catch {
      toast.error("Erro ao copiar", {
        description: "Não foi possível copiar o código.",
      });
    }
  }
  useEffect(() => {
    const channel = supabase
      .channel(`realtime code-snippets`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        filter: `identifier=eq.${identifier}`,
        table: "code_snippets",
      }, (payload) => {
        setActualCode(payload.new.content);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [identifier]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex gap-2">
        <div className="max-w-[80%] overflow-auto whitespace-nowrap">
          {tabs.filter((tab) => tab.content).map((tab) => {
            return (
              <a
                key={tab.id}
                href={`/${identifier}?tab=${tab.name}`}
                className="mr-2"
              >
                <Button
                  variant={tab.name === activeTabName ? "secondary" : "outline"}
                  size="sm"
                >
                  {tab.name}
                </Button>
              </a>
            );
          })}
        </div>
        <Button
          className="cursor-pointer ml-auto"
          variant="ghost"
          onClick={handleCopyCode}
        >
          Copiar
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <CodeMirror
        value={actualCode}
        height="auto"
        extensions={[javascript()]}
        editable={false}
        readOnly={true}
        className="border rounded-lg mt-2 max-h-[60vh] overflow-auto"
      />
    </div>
  );
}
