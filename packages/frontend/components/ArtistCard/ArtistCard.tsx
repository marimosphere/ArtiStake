import * as React from "react";
import { ArtistCardProps } from "./types";

const ArtistCard: React.FC<ArtistCardProps> = ({ index, name, description, avatar, thumbnail }) => {
  const bgColor = index % 2 === 0 ? "bg-marimo-1" : "bg-marimo-2";

  return (
    <div className={`w-full mx-auto p-8 ${bgColor}`}>
      <div className="flex mb-8">
        <img className="rounded-full w-12 h-12" src={avatar} />
        <div className="ml-4">
          <p className="text-black text-md mb-2">{name}</p>
          <p className="text-black h-20 text-xs">{description}</p>
        </div>
      </div>
      <div>
        <img className="w-64 h-64 mx-auto" src={thumbnail} />
      </div>
    </div>
  );
};

export default ArtistCard;
