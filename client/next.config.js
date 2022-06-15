const withAnalyzer = require("@next/bundle-analyzer")({
  enabled:
    process.env.ANALYZE === "true" && process.env.NODE_ENV !== "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      };

      ["highlight.js", "cheerio", "showdown", "@sanity/client"].map((lib) =>
        config.module.rules.push({
          test: new RegExp(lib),
          use: "null-loader",
        })
      );
    }

    return config;
  },
};

module.exports = withAnalyzer(nextConfig);
