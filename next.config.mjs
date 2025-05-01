/** @type {import('next').NextConfig} */
const nextConfig = {
  //   reactStrictMode: true,
  env: {
    API_URL: "http://localhost:4000",
  },
  images: {
    domains: ["localhost", "placehold.co"], // Add both localhost and placehold.co in a single array
  },
};

export default nextConfig;
