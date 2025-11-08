/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

// Define CSP for production & relaxed one for development
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' 'sha256-WAyOw4V+FqDc35lQPyRADLBWbuNK8ahvYEaQIYF1+Ps=';
  img-src 'self' data:;
  connect-src 'self' http://localhost:5000 https://preadvisable-targetless-hilaria.ngrok-free.dev;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
`;

const nextConfig = {
  experimental: {
    allowedDevOrigins: ["https://preadvisable-targetless-hilaria.ngrok-free.dev"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
