import { CodeEditor } from "./code-editor";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Code Editor</h1>
          <p className="text-muted-foreground">Escreva, edite e compartilhe com facilidade</p>
        </div>
        
        <Card className="border shadow-md">
          <CardContent>
            <CodeEditor />
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Feito com ❤️ e Next.js com supabase-realtime</p>
        </div>
      </div>
    </div>
  );
}