import { Card, CardContent } from "@/components/ui/card";
import { getInitialCode } from "./actions";
import { Button } from "@/components/ui/button";
import { TabCard } from "./tab-card";
import { CreateTabDropdown } from "./create-tab-dropdown";
import { CodeEditor } from "./code-editor";

interface CodeEditorCardProps {
  activeTabName: string | string[] | undefined;
}
export async function CodeEditorCard({ activeTabName }: CodeEditorCardProps) {
  const initialCode = await getInitialCode();

  const activeTab = activeTabName
    ? initialCode?.codeTabs.find((tab) => tab.name === activeTabName)
    : null;

  if (activeTab) {
    return (
      <Card className="border shadow-md">
        <CardContent>
          <CodeEditor tab={activeTab} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2 justify-end items-end">
      {initialCode?.codeTabs.length < 6 && (
        <CreateTabDropdown>
          <Button size="sm" variant="link">
            {initialCode?.codeTabs.length}/6 Nova tab?
          </Button>
        </CreateTabDropdown>
      )}
      <div className="grid grid-cols-3 gap-4 w-full">
        {initialCode?.codeTabs.map((tab) => {
          return <TabCard tab={tab} key={tab.id} />;
        })}
      </div>
    </div>
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
