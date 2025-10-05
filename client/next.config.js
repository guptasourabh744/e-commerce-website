/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com',
      'm.media-amazon.com',
      'images-na.ssl-images-amazon.com',
      'images-amazon.com',
      'amazon.com',
      'cdn.shopify.com',
      'i.imgur.com',
      'picsum.photos',
      'source.unsplash.com'
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api',
  },
}

module.exports = nextConfig
