/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "via.placeholder.com",
      "firebasestorage.googleapis.com",
      "img.youtube.com",
      "localhost",
      "image.gasskeuntopup.com",
      "cdn.aplikasikreasi.id",
      "i.ibb.co.com",
      "ik.imagekit.io",
    ],
  },
  output: "standalone",
};

module.exports = nextConfig;
