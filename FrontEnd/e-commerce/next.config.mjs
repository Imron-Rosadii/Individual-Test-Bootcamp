/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http", // Pastikan mendukung HTTP untuk localhost
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "https", // Jika ingin tetap mendukung gambar dari semua HTTPS
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
