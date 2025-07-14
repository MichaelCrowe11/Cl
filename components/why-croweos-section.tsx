import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, GitBranch, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: <GitBranch className="h-8 w-8 text-regenerative-violet" />,
    title: "Regenerative by Design",
    description: "Embed closed-loop SOPs and circular economy principles from the ground up.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-regenerative-violet" />,
    title: "End-to-End Provenance",
    description: "Achieve zero silent-fails and zero data-loss with immutable, verifiable logs.",
  },
  {
    icon: <Zap className="h-8 w-8 text-regenerative-violet" />,
    title: "Self-Healing Automation",
    description: "Over 99% of operational errors are autonomously resolved in under 5 minutes.",
  },
]

export default function WhyCroweOsSection() {
  return (
    <section className="py-16 md:py-24 bg-snow">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-almost-black">Why CroweOS Systems</h2>
          <p className="text-lg text-gray-600 mt-2">Where Fungi Meet Functions.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-regenerative-violet/20"
            >
              <CardHeader>
                <div className="mx-auto bg-regenerative-violet/10 p-4 rounded-full w-fit mb-4">{feature.icon}</div>
                <CardTitle className="font-display text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
