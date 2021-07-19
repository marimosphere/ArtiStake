import * as React from "react";

import { Header } from "../../components/Header";
import { ArtistHeader } from "../../components/ArtistHeader";
import { Stake } from "../../components/Stake";
import { ArtistWorks } from "../../components/ArtistWorks";

import { getAllArtists, getArtistByFileName } from "../../lib/api";

import { Artist } from "../../types/artist";

import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/aave/aave-v2-polygon-mumbai",
  cache: new InMemoryCache(),
});
interface Props {
  artist: Artist;
}

const ArtistPage: React.FC<Props> = ({ artist }) => {
  return (
    <ApolloProvider client={client}>
      <div>
        <Header />
        <ArtistHeader
          name={artist.name}
          description={artist.description}
          aboutMyWork={artist.aboutMyWork}
          avatar={artist.avatar}
          bannar={artist.bannar}
        />
        <Stake artistWalletAddress={artist.walletAddress} />
        <ArtistWorks
          walletAddress={artist.walletAddress}
          galleryTumbnail={artist.galleryTumbnail}
          galleryUrl={artist.galleryUrl}
          shopTumbnail={artist.shopTumbnail}
          shopUrl={artist.shopUrl}
        />
      </div>
    </ApolloProvider>
  );
};

export default ArtistPage;

export async function getStaticProps({ params }) {
  const artist = getArtistByFileName(`${params.artist}.md`);
  return {
    props: {
      artist: artist,
    },
  };
}

export async function getStaticPaths() {
  const artists = getAllArtists();
  return {
    paths: artists.map((artist) => ({
      params: {
        artist: artist.id,
      },
    })),
    fallback: false,
  };
}
