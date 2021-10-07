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
      <div className="w-full bg-marimo-1 p-8 lg:px-40">
        <h2 className="text-center text-white text-2xl mb-4">About ArtiStake</h2>
        <h3 className="text-white text-lg mb-4">-EN-</h3>
        <p className="text-white mb-4">
          ArtiStake is a platform to introduce the artist's worldview, concept, and other activities of the artist
          themselves, to communicate the artist's appeal, and to grow the fan community, artist community & ecosystem.
        </p>
        <p className="text-white mb-4">
          Participants can support the artists they want to support by staking and tipping. When tokens are staked, they
          are automatically invested in DeFi, and the staking rewards are rewarded to both artists and supporters.
        </p>
        <p className="text-white">
          Artists can send NFTs to supporters, invite them to closed Instagram, Discord, etc., communicate with fans and
          artists, and provide various rewards as incentives for supporters.
        </p>

        <p className="text-white mb-4">
          Please join us in "ArtiStake", a community of crypto artists which can connect artists and fans who want to
          support them and make everyone happy.
        </p>
        <h3 className="text-white text-lg mb-4">-JP-</h3>
        <p className="text-white mb-4">
          ArtiStakeは、アーティストの世界観やコンセプトなどアーティスト自身の活動を紹介し、アーティストの魅力を伝えて、ファンコミュニティ、アーティストコミュニティ&エコシステムを育てていくためのプラットフォームです。
        </p>
        <p className="text-white mb-4">
          参加者は自分が応援したいアーティストを、ステーキングや投げ銭で支援することができます。トークンがステーキングされると、自動的にDeFiで運用され、その運用益としてのステーキング報酬がアーティストと支援者の双方にリワードとして入ります。
        </p>
        <p className="text-white">
          アーティストは、サポーターにNFTを送ったり、クローズドのInstagramやDiscordなどに招待したり、ファンとのコミュニケーションを図ったり、様々な特典をリワードとしてつけていくことで、応援してもらうインセンティブを提供することができます。
        </p>
        <p className="text-white mb-4">
          アーティストと応援したいファンをつなぎ、みんながハッピーになれるクリプトアーティストのコミュニティに、あなたもぜひ参加してみてください。
        </p>
      </div>
      <div className="bg-marimo-4 h-3" />
      <div className="bg-marimo-3 h-6" />
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
