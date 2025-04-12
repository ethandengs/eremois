'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface FeatureCardProps {
  title: string
  description: string
  image: string
  color: string
  delay?: number
}

const FeatureCard = ({ title, description, image, color, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5 }}
    className={`rounded-3xl p-8 hover:bg-opacity-90 transition-all ${color}`}
  >
    <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
      />
    </div>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
)

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const containerRef = useRef(null)
  const router = useRouter()

  const heroImages = [
    '/images/cover 1.png',
    '/images/cover 2.png',
    '/images/3. HOME - 1.H.png',
    '/images/2. LOCK SCREEN.png'
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-[#111111] text-white" ref={containerRef}>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#FF4B4B] z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 overflow-hidden"
        >
          <Image
            src={heroImages[currentImage]}
            alt="Eremois Interface"
            fill
            className="object-cover opacity-20"
            priority
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              Time Management,
              <br />
              <span>
                Reimagined
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 tracking-tight max-w-2xl">
              Experience a new way to manage your time with AI-powered insights and beautiful visualizations.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link href="/signin">
                <button
                  type="button"
                  className="bg-[#FF4B4B] px-4 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-medium hover:bg-[#FF6B6B] transition-colors"
                >
                  Start Free Trial
                </button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button
                type="button"
                className="border-2 border-white px-4 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-medium hover:bg-white hover:text-black transition-colors"
              >
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Why Choose eremois?</h2>
            <p className="text-xl text-gray-300">Discover the features that make us different</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Smart Organization"
              description="AI-powered task organization that adapts to your working style"
              image="/images/3. HOME - 3.W - 1.png"
              color="bg-gray-800/50"
              delay={0}
            />
            <FeatureCard
              title="Visual Planning"
              description="Intuitive circular interface for natural time management"
              image="/images/3. HOME - 4.M - 1.png"
              color="bg-gray-800/50"
              delay={0.2}
            />
            <FeatureCard
              title="Deep Insights"
              description="Understand your productivity patterns with detailed analytics"
              image="/images/3. HOME - 5.Y - 1.png"
              color="bg-gray-800/50"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Time Circle Feature */}
      <section className="py-32 bg-gray-900/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full rounded-[32px] overflow-hidden bg-black"
            >
              <Image
                src="/images/6. ADD -0copy 5.jpg"
                alt="Time Circle Interface"
                width={800}
                height={800}
                className="w-full h-auto rounded-[32px]"
                priority
              />
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold tracking-tight mb-8">Visual Time Planning</h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Our unique circular interface makes time management intuitive and beautiful. 
                See your day unfold in a natural, cyclical way that matches how you think about time.
              </p>
              <div className="space-y-4 text-lg text-gray-300">
                {[
                  { color: '#FF6B6B', text: 'Intuitive task organization' },
                  { color: '#2ECC71', text: 'Smart time blocking' },
                  { color: '#3498DB', text: 'AI-powered scheduling' }
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="flex items-center"
                  >
                    <span className="w-3 h-3 rounded-full mr-4" style={{ backgroundColor: item.color }} />
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Screenshots</h2>
            <p className="text-xl text-gray-300">See eremois in action</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              '/images/3. HOME - 2.D.png',
              '/images/3. HOME - 3.W - 2.png',
              '/images/3. HOME - 4.M - 2.png',
              '/images/4. AI-setup center-1.png',
              '/images/6. ADD -0.png',
              '/images/6. ADD -1.png',
              '/images/6. ADD -2.png',
              '/images/7. ORGANIZE -C.png',
            ].map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`Interface ${index + 1}`}
                  width={500}
                  height={500}
                  className="w-full h-auto hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/6. ADD -3 copy.jpg"
            alt="Background"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold tracking-tight mb-8">Ready to Transform Your Time?</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have discovered a more mindful way to manage their time.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link href="/signin">
              <button
                type="button"
                className="bg-[#FF4B4B] px-10 py-4 rounded-xl text-xl font-bold hover:bg-[#FF6B6B] transition-all duration-300"
              >
                Get Started Now
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Subtle Design System Link */}
      <div className="py-12 mb-8 text-center">
        <a 
          href="https://eremoisdesignsystem.ethandengs.work" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-600 hover:text-gray-400 text-sm transition-colors inline-flex items-center gap-2 py-2 px-4 rounded-full border border-gray-800 hover:border-gray-700"
        >
          <span>Design Resources</span>
          <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="External link">
            <title>External link</title>
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </main>
  )
}
