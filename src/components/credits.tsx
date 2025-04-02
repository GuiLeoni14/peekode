import Image from "next/image";

export function Credits() {
  return (
    <div className="flex items-center gap-2 text-center text-sm text-muted-foreground">
      <p>
        Feito com ❤️ e Next.js com supabase-realtime
      </p>
      <a href="https://github.com/GuiLeoni14/peekode" target="_blank" rel="noopener noreferrer">
        <Image
          src="/assets/github-icon.svg"
          width={16}
          height={16}
          alt=""
          className="mr-2 size-4 dark:invert"
        />
      </a>
    </div>
  );
}
