/** @type {import('next').NextConfig} */
const nextConfig = {
  //   reactStrictMode: true,
  env: {
    API_URL: "http://localhost:4000",
  },
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
