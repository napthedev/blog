import "../styles/globals.css";
import "../styles/stackoverflow-dark.css";

import type { AppProps } from "next/app";
import Footer from "../components/Footer";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          property="fb:app_id"
          content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
        />
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <div id="fb-root"></div>
      <Script
        strategy="worker"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      ></Script>
      <script
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `,
        }}
      />
      <script
        data-partytown-config
        dangerouslySetInnerHTML={{
          __html: `
          partytown = {
            lib: "/_next/static/~partytown/",
            forward: ["gtag"]
          };
        `,
        }}
      />
    </>
  );
}

export default MyApp;
