import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lab.ibrahim-eng.dev'
  const lastModified = new Date()

  const pages = [
    'illusion',
    'weight',
    'horizon',
    'fragility',
    'paradox',
    'echo',
    'blindness',
    'butterfly',
  ]

  return [
    { url: `${baseUrl}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    ...pages.map((slug) => ({
      url: `${baseUrl}/${slug}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
