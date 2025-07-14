import Image from "next/image"
import Link from "next/link"
import { Twitter, Linkedin, Github } from "lucide-react"

const productLinks = [
  { name: "Features", href: "#features" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "Request Access", href: "#" },
]

const resourceLinks = [
  { name: "Docs", href: "#" },
  { name: "API", href: "#" },
  { name: "Community", href: "#" },
]

const companyLinks = [
  { name: "Licensing", href: "#" },
  { name: "Privacy Policy", href: "#" },
]

export default function SiteFooter() {
  return (
    <footer className="bg-charcoal text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-4 items-start">
            <Link href="/">
              <div
                style={{
                  filter: "drop-shadow(0 0 8px #7B3FF2) drop-shadow(0 0 3px #B44CFF)",
                }}
              >
                <Image
                  src="/croweos-systems-logo-full-white.png"
                  alt="CroweOS Systems Logo"
                  width={180}
                  height={40}
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm">Mushrooms • Machines • Meaning.</p>
            <div className="flex gap-4 mt-2">
              <Link href="#" aria-label="Twitter" className="hover:text-regenerative-violet transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="hover:text-regenerative-violet transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="#" aria-label="GitHub" className="hover:text-regenerative-violet transition-colors">
                <Github size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-display text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-display text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-display text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© 2025 Crowe OS Systems. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
