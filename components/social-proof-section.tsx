"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

const testimonials = [
  {
    text: "CroweOS transformed our yield forecasting. The predictive contamination alerts alone saved us from a potential 20% crop loss. Game-changing.",
    author: "CEO, Southwest Mushrooms™",
  },
  {
    text: "The self-healing automation is not just a feature, it's our new reality. Downtime is a thing of the past. Our systems are truly alive.",
    author: "Lead Researcher, Crowe Mycology Research Institute",
  },
]

const logos = [
  { name: "Southwest Mushrooms™", url: "/placeholder.svg?height=40&width=150" },
  { name: "Crowe Mycology Research Institute", url: "/placeholder.svg?height=40&width=150" },
  { name: "MycoSoft", url: "/placeholder.svg?height=40&width=150" },
  { name: "RegenAgri", url: "/placeholder.svg?height=40&width=150" },
]

export default function SocialProofSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-charcoal text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-12">
          {logos.map((logo) => (
            <Image
              key={logo.name}
              src={logo.url || "/placeholder.svg"}
              alt={logo.name}
              width={150}
              height={40}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
        <div className="relative text-center max-w-3xl mx-auto h-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <p className="text-xl md:text-2xl italic">"{testimonials[index].text}"</p>
              <p className="mt-4 font-bold text-regenerative-violet">{testimonials[index].author}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
