import { MetadataRoute } from 'next'

const baseUrl = 'https://eremois.ethandengs.work'

export default function sitemap(): MetadataRoute.Sitemap {
  // Get the current date for lastModified
  const currentDate = new Date()

  // Define your routes here
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/living-timeline`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  ]

  return routes
} 