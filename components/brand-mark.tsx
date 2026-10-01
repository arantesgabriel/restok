import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <Image src="/brand/restok-logo.png" alt="Restok" width={124} height={41} priority className={compact ? "h-9 w-[108px] object-contain" : "h-[41px] w-[124px] object-contain"} />;
}
