import Link from "next/link";
import { CroweLogo } from "@/components/crowe-logo";

export default function GlobalHeader() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700 shadow-lg z-50 fixed top-0">
      <div className="flex items-center gap-3">
        <Link href="/platform" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <CroweLogo 
            variant="official-circle"
            systemBranding={true}
            size="md"
            showText={true}
            darkTheme={true}
          />
        </Link>
      </div>
      <nav className="flex items-center gap-6">
        <Link href="/platform" className="text-sm font-medium text-slate-200 hover:text-white hover:underline transition-colors">
          Platform
        </Link>
        <Link href="/ide" className="text-sm font-medium text-slate-200 hover:text-white hover:underline transition-colors">
          IDE
        </Link>
        <Link href="/crowe-logic" className="text-sm font-medium text-slate-200 hover:text-white hover:underline transition-colors">
          AI Assistant
        </Link>
        <Link href="/" className="text-sm font-medium text-slate-200 hover:text-white hover:underline transition-colors">
          Home
        </Link>
      </nav>
    </header>
  );
}
