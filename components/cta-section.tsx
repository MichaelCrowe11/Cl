import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-almost-black">Join the Beta Guild</h2>
        <p className="text-lg text-gray-600 mt-4 mb-8">
          We’re onboarding 100 pioneers across biotech, ag-tech, and climate-tech. Be among the first to experience
          Crowe Logic AI.
        </p>
        <form className="grid sm:grid-cols-3 gap-4">
          <Input type="email" placeholder="your.email@company.com" className="sm:col-span-2 h-12 text-base" />
          <Select>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cultivation">Cultivation Ops</SelectItem>
              <SelectItem value="research">Researcher</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="founder">Founder/Exec</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button size="lg" className="gradient-sweep-button text-white font-bold text-base sm:col-span-3 h-12">
            Join the Beta Guild
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-4">We respond in ≤ 72 hours with onboarding steps.</p>
      </div>
    </section>
  )
}
