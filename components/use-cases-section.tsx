import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Microscope, Leaf, DraftingCompass } from "lucide-react"

const useCases = [
  {
    icon: <Microscope className="h-8 w-8 text-regenerative-violet" />,
    title: "Cultivation Ops",
    description: "Substrate modelling & yield forecasting.",
  },
  {
    icon: <Leaf className="h-8 w-8 text-regenerative-violet" />,
    title: "Environmental Intelligence (EI)",
    description: "1M-site remediation simulations.",
  },
  {
    icon: <DraftingCompass className="h-8 w-8 text-regenerative-violet" />,
    title: "Regenerative Business Blueprints",
    description: "30/60/90-day OKRs.",
  },
]

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="py-16 md:py-24 bg-snow">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Built for These Use-Cases</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="relative use-case-card p-0.5 rounded-2xl">
              <Card className="h-full bg-white rounded-xl">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">{useCase.icon}</div>
                  <CardTitle className="font-display text-xl text-almost-black">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{useCase.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
