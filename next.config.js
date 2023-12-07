/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["via.placeholder.com", "firebasestorage.googleapis.com", "img.youtube.com"],
    },
    output: "standalone",
};

module.exports = nextConfig;

