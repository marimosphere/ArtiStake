import * as React from "react";
import Head from "next/head";

const Seo: React.FC = () => {
  return (
    <Head>
      <title>ArtiStake - Artist Staking Platform</title>
      <link rel="icon" href="https://artistake.tokyo/favicon.ico" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:url" content="https://artistake.tokyo.app" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="ArtiStake - Artist Staking Platform" />
      <meta property="og:description" content=" ArtiStake supports artists by staking tokens" />
      <meta property="og:site_name" content="ArtiStake" />
      <meta property="og:image" content="https://artistake.tokyo/assets/img/hero.png" />
    </Head>
  );
};

export default Seo;
