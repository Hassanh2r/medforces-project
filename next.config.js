// next.config.js
module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*).(js|css|png|jpg|jpeg|svg|ico|woff2?)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, must-revalidate" }
        ]
      }
    ];
  }
};
