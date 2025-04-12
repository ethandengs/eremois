'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#111111] text-white relative">
      {/* Background Image */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/6. ADD -3 copy.jpg"
          alt="Background"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div> */}

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
} 