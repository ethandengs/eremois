'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface FeatureCardProps {
  title: string
  description: string
  image: string
  link: string
}

const FeatureCard = ({ title, description, image, link }: FeatureCardProps) => (
  <Link href={link}>
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800/50 rounded-[32px] overflow-hidden cursor-pointer"
    >
      <div className="relative w-full aspect-video">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  </Link>
)

export default function Features() {
  return (
    <main className="min-h-screen bg-[#111111] text-white pt-24">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-bold mb-6">Core Features</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how eremois combines privacy-focused AI, natural time management, 
              and thoughtful design to create a unique productivity experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Living Timeline"
              description="A circular visualization that adapts to your natural rhythms, offering multi-scale views from hours to years."
              image="/images/3. HOME - 4.M - 1.png"
              link="/features/living-timeline"
            />
            <FeatureCard
              title="Task Management"
              description="Intelligent organization with Events, Tasks, and Projects, each adapting to your energy levels and priorities."
              image="/images/6. ADD -0.png"
              link="/features/task-management"
            />
            <FeatureCard
              title="Edge AI"
              description="Privacy-preserving artificial intelligence that learns and adapts locally on your device."
              image="/images/4. AI-setup center-1.png"
              link="/features/edge-ai"
            />
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">Privacy as Foundation</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B6B] mr-3" />
                  Data remains on your devices
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#2ECC71] mr-3" />
                  AI learns locally, adapts privately
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#3498DB] mr-3" />
                  End-to-end encrypted sync (optional)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B6B] mr-3" />
                  Complete offline functionality
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-[32px] overflow-hidden"
            >
              <Image
                src="/images/7. ORGANIZE -C.png"
                alt="Privacy First"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Choose Your Setup</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From personal installations to enterprise deployments, eremois adapts to your needs while maintaining privacy.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/use-cases/personal">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 p-8 rounded-[32px] cursor-pointer"
              >
                <h3 className="text-2xl font-bold mb-4">Personal</h3>
                <p className="text-gray-300">Run entirely on your devices with zero data sharing and P2P sync.</p>
              </motion.div>
            </Link>
            <Link href="/use-cases/teams">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 p-8 rounded-[32px] cursor-pointer"
              >
                <h3 className="text-2xl font-bold mb-4">Self-Hosted</h3>
                <p className="text-gray-300">Control your infrastructure with multi-device sync and team sharing.</p>
              </motion.div>
            </Link>
            <Link href="/use-cases/enterprise">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 p-8 rounded-[32px] cursor-pointer"
              >
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <p className="text-gray-300">Advanced security, custom authentication, and scalable architecture.</p>
              </motion.div>
            </Link>
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
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Choose the setup that works best for you and start managing your time with privacy and intelligence.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link href="/docs/guide/getting-started">
                <button
                  type="button"
                  className="bg-[#FF6B6B] px-8 py-4 rounded-xl text-lg font-medium hover:bg-[#FF8787] transition-colors"
                >
                  View Setup Guide
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 