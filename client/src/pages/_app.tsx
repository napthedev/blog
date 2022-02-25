import "../styles/globals.css";

import type { AppProps } from "next/app";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <div id="fb-root"></div>
      <Script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v13.0&appId=1005788883628478&autoLogAppEvents=1"
        nonce="zKY7VpTL"
        strategy="lazyOnload"
      ></Script>
    </>
  );
}

export default MyApp;
