"use client";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";

interface CodeHighlighterProps {
  identifier: string;
  initialCode: string;
}
export function CodeHighlighter(
  { initialCode, identifier }: CodeHighlighterProps,
) {
  const [actualCode, setActualCode] = useState(initialCode);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime code-snippet`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        filter: `identifier=eq.${identifier}`,
        table: "CodeSnippet",
      }, (payload) => {
        setActualCode(payload.new.content);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [identifier]);

  return (
    <div className="w-full">
      <CodeMirror
        value={actualCode}
        height="auto"
        extensions={[javascript()]}
        editable={false}
        readOnly={true}
        className="border rounded-lg"
      />
    </div>
  );
}
