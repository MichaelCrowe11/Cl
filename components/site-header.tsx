"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CroweOSLogo } from "@/components/croweos-logo-system"

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "Docs", href: "#" },
  { name: "Community", href: "#" },
]

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CroweOSLogo 
            size="lg" 
            showText 
            className="text-white drop-shadow-[0_0_8px_#7B3FF2]" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute top-20 left-0 right-0 bg-charcoal transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-screen border-t border-gray-700" : "max-h-0",
        )}
      >
        <nav className="flex flex-col items-center gap-4 p-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors text-lg font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
