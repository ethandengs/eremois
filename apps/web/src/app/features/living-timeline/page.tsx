'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface TimeScaleProps {
  title: string
  description: string
  image: string
  scale: string
}

const TimeScale = ({ title, description, image, scale }: TimeScaleProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="flex flex-col md:flex-row gap-8 items-center"
  >
    <div className="w-full md:w-1/2">
      <span className="text-[#FF6B6B] font-medium">{scale}</span>
      <h3 className="text-3xl font-bold mt-2 mb-4">{title}</h3>
      <p className="text-gray-300 text-lg">{description}</p>
    </div>
    <div className="w-full md:w-1/2">
      <div className="relative aspect-square rounded-[32px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    </div>
  </motion.div>
)

export default function LivingTimeline() {
  return (
    <main className="min-h-screen bg-[#111111] text-white pt-24">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/3. HOME - 4.M - 1.png"
            alt="Living Timeline"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl font-bold mb-6">Living Timeline</h1>
            <p className="text-xl text-gray-300">
              A revolutionary approach to time visualization that adapts to your natural rhythms. 
              Our circular interface makes time management intuitive and beautiful, helping you see your 
              schedule in a way that matches how you naturally think about time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Time Scales */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            <TimeScale
              scale="H｜hour scale"
              title="Current Time & Minutes"
              description="Visual clock showing your current time and upcoming schedule for the next few hours. Perfect for immediate task management and time awareness."
              image="/images/3. HOME - 1.H.png"
            />
            <TimeScale
              scale="D｜day scale"
              title="Daily Overview"
              description="Split blocks with detailed descriptions of your daily schedule. Get a clear view of your day's commitments and available time slots."
              image="/images/3. HOME - 2.D.png"
            />
            <TimeScale
              scale="W｜week scale"
              title="Weekly Distribution"
              description="Multiple bars showing your schedule distribution across the week. Click to view specific day's schedule and plan your week effectively."
              image="/images/3. HOME - 3.W - 1.png"
            />
            <TimeScale
              scale="M｜month scale"
              title="Monthly Patterns"
              description="Choose between daily or weekly views to understand your monthly schedule distribution and identify patterns in your time usage."
              image="/images/3. HOME - 4.M - 2.png"
            />
            <TimeScale
              scale="Y｜year scale"
              title="Yearly Overview"
              description="Get a bird's eye view of your year with monthly schedule overviews. Perfect for long-term planning and pattern recognition."
              image="/images/3. HOME - 5.Y - 1.png"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Key Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our living timeline adapts to how you naturally work and think about time.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0 }}
              className="bg-gray-800/50 p-8 rounded-[32px]"
            >
              <h3 className="text-2xl font-bold mb-4">Natural Rhythms</h3>
              <p className="text-gray-300">
                Circular visualization that matches your intuitive understanding of time cycles.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800/50 p-8 rounded-[32px]"
            >
              <h3 className="text-2xl font-bold mb-4">Smart Adaptation</h3>
              <p className="text-gray-300">
                AI-powered interface that learns from your usage patterns and energy levels.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-800/50 p-8 rounded-[32px]"
            >
              <h3 className="text-2xl font-bold mb-4">Multi-Scale Views</h3>
              <p className="text-gray-300">
                Seamlessly switch between hour, day, week, month, and year views.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Experience Natural Time Management</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Try our living timeline and discover a more intuitive way to manage your time.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button
                type="button"
                className="bg-[#FF6B6B] px-8 py-4 rounded-xl text-lg font-medium hover:bg-[#FF8787] transition-colors"
              >
                Start Free Trial
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 