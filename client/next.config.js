/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    };
    if (!isServer) {
      config.module.rules.push({
        test: /\b(?:highlight\.js|cheerio|showdown)\b/gi,
        use: "null-loader",
      });
    }

    return config;
  },
};

module.exports = nextConfig;
