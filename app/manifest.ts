import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Crowe Logic AI - Mycology Lab Assistant',
    short_name: 'Crowe Logic AI',
    description: 'Professional mycology lab management and cultivation assistant powered by AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/crowe-avatar.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
