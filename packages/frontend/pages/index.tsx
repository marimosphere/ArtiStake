import * as React from "react";

import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ArtistCard } from "../components/ArtistCard";
import { About } from "../components/About";

import { getAllArtists } from "../lib/api";
import { Artist } from "../types/artist";

interface Props {
  artists: Artist[];
}

const IndexPage: React.FC<Props> = ({ artists }) => {
  return (
    <div>
      <Header />
      <Hero />
      <About />
    </div>
  );
};

export default IndexPage;

export const getStaticProps = async () => {
  const artists = getAllArtists();
  return {
    props: { artists },
  };
};
