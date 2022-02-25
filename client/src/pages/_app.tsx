import "../styles/globals.css";

import type { AppProps } from "next/app";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <div id="fb-root"></div>
    </>
  );
}

export default MyApp;
