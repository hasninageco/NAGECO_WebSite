import Link from "next/link";
import clsx from "clsx";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
  src?: string;
};

export function BrandLogo({ compact = false, className, src = "/nageco-logo.svg" }: BrandLogoProps) {
  const logoWidth = 963;
  const logoHeight = 333;

  return (
    <Link href="/" className="inline-flex items-center">
      <img
        src={src}
        alt="NAGECO Logo"
        width={logoWidth}
        height={logoHeight}
        fetchPriority="high"
        className={clsx(compact ? "h-auto w-52 object-contain" : "h-auto w-[1040px] max-w-full object-contain", className)}
      />
    </Link>
  );
}

export function InlineBrandLogo({ className }: { className?: string }) {
  return (
    <img
      src="/nageco-logo.svg"
      alt="NAGECO Logo"
      width={963}
      height={333}
      className={clsx("inline-block h-auto w-28 align-[-0.28em] object-contain", className)}
    />
  );
}