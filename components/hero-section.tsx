import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"
import { CroweLogicAvatar } from "@/components/croweos-logo-system"

export default function HeroSection() {
  return (
    <section className="relative bg-charcoal bg-spore-pattern bg-repeat bg-opacity-25 text-white overflow-hidden pt-20">
      <div className="container mx-auto px-6 py-24 md:py-32 lg:py-40">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-white">
              Crowe Logic AI — Bio-Intelligence for Regenerative Enterprise.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl">
              Fuse advanced mycology, ML-automation, and zero-data-loss architecture into every workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gradient-sweep-button text-white font-bold text-base">
                Request Early Access
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-charcoal font-bold text-base"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch 90-sec Demo
              </Button>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full animate-pulse-glow">
                <CroweLogicAvatar 
                  size={320} 
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                Built by Michael Crowe • Powered by CroweOS™
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
