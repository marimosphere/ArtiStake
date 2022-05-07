import * as React from "react";

import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ArtistCard } from "../components/ArtistCard";
import { Footer } from "../components/Footer";

import { getAllArtists } from "../lib/api";
import { Artist } from "../types/artist";

interface Props {
  artists: Artist[];
}

const IndexPage: React.FC<Props> = ({ artists }) => {
  return (
    <div className="overflow-hidden">
      <Header isConnectWallet={false} />
      <Hero />
      <div className="w-full mx-auto grid lg:grid-cols-3 bg-marimo-1">
        {artists.map((artist, index) => {
          return (
            <a href={`/artists/${artist.id}`} key={index}>
              <ArtistCard
                index={index}
                name={artist.name}
                description={artist.description}
                avatar={artist.avatar}
                thumbnail={artist.thumbnail}
              ></ArtistCard>
            </a>
          );
        })}
      </div>
      <Footer />
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
