"use client"

import { motion, TargetAndTransition, VariantLabels } from "framer-motion"
import type React from "react"

interface MotionWrapperProps {
  children: React.ReactNode
  className?: string
  initial?: boolean | TargetAndTransition | VariantLabels
  whileInView?: TargetAndTransition | VariantLabels
  transition?: object
}

export function MotionWrapper({
  children,
  className,
  initial = { opacity: 0, y: 20 },
  whileInView = { opacity: 1, y: 0 },
  transition = { duration: 0.5 },
}: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={whileInView}
      transition={transition}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}
