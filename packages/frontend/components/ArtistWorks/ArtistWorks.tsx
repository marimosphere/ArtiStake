import * as React from "react";
import QRCode from "qrcode.react";
import { ArtistWorksProps } from "./types";
import { Tip } from "../Tip";

const ArtistWorks: React.FC<ArtistWorksProps> = ({
  walletAddress,
  galleryTumbnail,
  galleryUrl,
  shopTumbnail,
  shopUrl,
}) => {
  return (
    <div className="w-full mx-auto grid lg:grid-cols-3">
      <div className="bg-marimo-2 p-4">
        <p className="text-center text-black text-xl">Project Gallery</p>
        <div className="p-8">
          <a href={galleryUrl} target="_blank" rel="noreferrer">
            <img className="mx-auto h-48 object-cover" src={galleryTumbnail} />
          </a>
        </div>
      </div>
      <div className="bg-marimo-1 p-4">
        <p className="text-center text-black text-xl">Stake in Metaverse</p>
        <div className="p-8">
          <a href={shopUrl} target="_blank" rel="noreferrer">
            <img className="mx-auto h-48 object-cover" src={shopTumbnail} />
          </a>
        </div>
      </div>
      <div className="bg-marimo-2 p-4">
        <p className="text-center text-black text-xl">Tip The Project</p>
        <div className="flex justify-center p-8">
          <Tip artistWalletAddress={walletAddress} />
        </div>
      </div>
    </div>
  );
};

export default ArtistWorks;
