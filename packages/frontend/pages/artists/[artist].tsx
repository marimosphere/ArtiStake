import * as React from "react";

import { Header } from "../../components/Header";
import { ArtistHeader } from "../../components/ArtistHeader";
import { ArtistWorks } from "../../components/ArtistWorks";

import { getAllArtists, getArtistByFileName } from "../../lib/api";

import { Artist } from "../../types/artist";

interface Props {
  artist: Artist;
}

const ArtistPage: React.FC<Props> = ({ artist }) => {
  console.log(artist);

  return (
    <div>
      <Header />
      <ArtistHeader
        name={artist.name}
        description={artist.description}
        aboutMyWork={artist.aboutMyWork}
        avatar={artist.avatar}
        bannar={artist.bannar}
      />
      <ArtistWorks
        walletAddress={artist.walletAddress}
        galleryTumbnail={artist.galleryTumbnail}
        galleryUrl={artist.galleryUrl}
        shopTumbnail={artist.shopTumbnail}
        shopUrl={artist.shopUrl}
      />
    </div>
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
