import Image from "next/image"

export default function FeatureStackSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 space-y-20">
        {/* Feature A */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-3xl font-bold mb-4">A. Adaptive Decision Trees</h3>
            <p className="text-gray-600 text-lg mb-4">
              Dynamically generate and optimize workflows based on real-time data, mimicking mycelial network
              intelligence to find the most efficient path.
            </p>
            <div className="relative group">
              <p className="text-sm text-regenerative-violet font-mono cursor-help">
                Tooltip: 0.9 AU-ROC predictive contamination alerts.
              </p>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Adaptive Decision Trees Diagram"
              layout="fill"
              objectFit="cover"
              className="opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image src="/mycelium-branch.png" alt="Mycelium Icon" width={120} height={120} />
            </div>
          </div>
        </div>

        {/* Feature B */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden order-last md:order-first">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Sensor-Driven Context Linking Screenshot"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold mb-4">B. Sensor-Driven Context Linking</h3>
            <p className="text-gray-600 text-lg">
              Ingest and correlate data from any sensor (VOC, CO₂, RH) to create a rich, contextual understanding of
              your environment or process.
            </p>
          </div>
        </div>

        {/* Feature C */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-3xl font-bold mb-4">C. Tiered Outputs</h3>
            <p className="text-gray-600 text-lg mb-4">
              From raw JSON for developers to automated SOPs for operators and visual exports for stakeholders, get the
              right data in the right format.
            </p>
            <pre className="bg-charcoal text-white p-4 rounded-lg text-sm overflow-x-auto">
              <code>
                {`{
  "eventId": "contam_alert_01H",
  "confidence": 0.97,
  "recommendedSop": "SOP-C-42b",
  "visualExport": "/reports/vis-01H.pdf"
}`}
              </code>
            </pre>
          </div>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Tiered Outputs Visualization"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
