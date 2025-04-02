import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/assets/peekodedark.svg" width={38} height={38} alt="Logo" />
      <h1 className="text-3xl font-bold tracking-tight">
        PeeKode <span className="hidden">Compartilhe seu código</span>
      </h1>
    </div>
  );
}
