import { Card, CardContent } from "@/components/ui/card";
import { CodeEditor } from "./code-editor";
import { getInitialCode } from "./actions";

export async function CodeEditorCard() {
  const initialCode = await getInitialCode();
  return (
    <Card className="border shadow-md">
      <CardContent>
        <CodeEditor initialCode={initialCode} />
      </CardContent>
    </Card>
  );
}

export function CodeEditorCardFallback() {
  return (
    <Card className="border shadow-md">
      <CardContent>
        <div className="h-[60px] flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            Comece a editar
          </span>
          <div className="w-full h-[90%] bg-gray-300 rounded animate-pulse">
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
