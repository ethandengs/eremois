'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const menuItems = [
  {
    title: 'Features',
    items: [
      { name: 'Overview', href: '/features' },
      { name: 'Living Timeline', href: '/features/living-timeline' },
      { name: 'Task Management', href: '/features/task-management' },
      { name: 'Edge AI', href: '/features/edge-ai' },
    ],
  },
  {
    title: 'About',
    items: [
      { name: 'Our Vision', href: '/about' },
      { name: 'Privacy', href: '/about/privacy' },
      { name: 'Technology', href: '/about/technology' },
    ],
  },
  {
    title: 'Use Cases',
    items: [
      { name: 'Personal', href: '/use-cases/personal' },
      { name: 'Teams', href: '/use-cases/teams' },
      { name: 'Enterprise', href: '/use-cases/enterprise' },
    ],
  },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isOpen ? 'bg-[#111111]/80 backdrop-blur-lg' : ''
        }`}
      >
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            eremois
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/ethandengs/eremois"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
              title="View on GitHub"
            >
              <GitHubIcon />
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button
                type="button"
                className="bg-[#FF4B4B] px-6 py-2 rounded-xl font-medium hover:bg-[#FF6B6B] transition-colors"
                onClick={() => router.push('/signin')}
              >
                Get Started
              </button>
            </motion.div>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 relative focus:outline-none"
              aria-label="Menu"
            >
              <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span
                  aria-hidden="true"
                  className={`block absolute h-0.5 w-5 bg-white transform transition duration-300 ease-in-out ${
                    isOpen ? 'rotate-45' : '-translate-y-1.5'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`block absolute h-0.5 w-5 bg-white transform transition duration-300 ease-in-out ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`block absolute h-0.5 w-5 bg-white transform transition duration-300 ease-in-out ${
                    isOpen ? '-rotate-45' : 'translate-y-1.5'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 bg-[#111111]/95 pt-24 overflow-auto"
        >
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {menuItems.map((section) => (
                <div key={section.title}>
                  <h3 className="text-lg font-medium text-gray-400 mb-6">{section.title}</h3>
                  <ul className="space-y-4">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`text-2xl font-bold hover:text-[#FF6B6B] transition-colors ${
                            pathname === item.href ? 'text-[#FF6B6B]' : 'text-white'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
} 