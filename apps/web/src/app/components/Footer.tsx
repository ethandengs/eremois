'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const footerSections = {
  default: [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Living Timeline', href: '/features/living-timeline' },
        { name: 'Task Management', href: '/features/task-management' },
        { name: 'Edge AI', href: '/features/edge-ai' },
      ],
    },
    {
      title: 'Documentation',
      links: [
        { name: 'Technical Architecture', href: 'https://github.com/ethandengs/eremois/blob/main/docs/architecture/overview.md' },
        { name: 'Privacy Design', href: 'https://github.com/ethandengs/eremois/blob/main/docs/guide/privacy.md' },
        { name: 'API Documentation', href: 'https://github.com/ethandengs/eremois/blob/main/docs/api/README.md' },
        { name: 'Contribution Guidelines', href: 'https://github.com/ethandengs/eremois/blob/main/CONTRIBUTING.md' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Privacy', href: '/about/privacy' },
        { name: 'Technology', href: '/about/technology' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Use Cases',
      links: [
        { name: 'Personal', href: '/use-cases/personal' },
        { name: 'Teams', href: '/use-cases/teams' },
        { name: 'Enterprise', href: '/use-cases/enterprise' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms', href: '/legal/terms' },
        { name: 'Privacy Policy', href: '/legal/privacy' },
        { name: 'Cookie Policy', href: '/legal/cookies' },
      ],
    },
  ],
  personal: [
    {
      title: 'Setup',
      links: [
        { name: 'Installation', href: '/docs/installation' },
        { name: 'Configuration', href: '/docs/configuration' },
        { name: 'Data Sync', href: '/docs/sync' },
      ],
    },
  ],
  teams: [
    {
      title: 'Resources',
      links: [
        { name: 'Server Setup', href: '/docs/server-setup' },
        { name: 'Team Management', href: '/docs/team-management' },
        { name: 'Security', href: '/docs/security' },
      ],
    },
  ],
  enterprise: [
    {
      title: 'Enterprise',
      links: [
        { name: 'Deployment', href: '/enterprise/deployment' },
        { name: 'Authentication', href: '/enterprise/auth' },
        { name: 'Support', href: '/enterprise/support' },
      ],
    },
  ],
}

export default function Footer() {
  const pathname = usePathname()
  
  // Determine which sections to show based on the current path
  let sections = [...footerSections.default]
  if (pathname.includes('/use-cases/personal')) {
    sections = [...sections, ...footerSections.personal]
  } else if (pathname.includes('/use-cases/teams')) {
    sections = [...sections, ...footerSections.teams]
  } else if (pathname.includes('/use-cases/enterprise')) {
    sections = [...sections, ...footerSections.enterprise]
  }

  return (
    <footer className="bg-gray-900/50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-6">eremois</h3>
            <p className="text-gray-400 mb-4">
              Thoughtfully designed time management with edge AI, respecting your privacy.
            </p>
            <a
              href="https://github.com/ethandengs/eremois"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                      {...(link.href.startsWith('http') ? {
                        target: '_blank',
                        rel: 'noopener noreferrer'
                      } : {})}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2024 eremois. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 