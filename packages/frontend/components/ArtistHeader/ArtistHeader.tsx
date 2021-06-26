import * as React from "react";
import { ArtistHeaderProps } from "./types";

const ArtistHeader: React.FC<ArtistHeaderProps> = ({ name, description, aboutMyWork, avatar, bannar }) => {
  return (
    <div className="w-full mx-auto bg-marimo-1">
      <div className="flex pt-4 pb-8">
        <div className="flex px-8">
          <div>
            <img className="w-40 rounded-full" src={avatar} />
          </div>
          <div className="ml-4">
            <p className="text-white text-2xl mb-2">{name}</p>
            <p className="text-white text-xs">{description}</p>
          </div>
        </div>
        <div>
          <img className="w-full h-48 object-cover" src={bannar} />
        </div>
      </div>
      <div className="bg-marimo-3 h-6 text-white">
        <p className="ml-8 text-md">About My Works</p>
      </div>
      <div>
        <p className="text-white text-xs p-8">{aboutMyWork}</p>
      </div>
    </div>
  );
};

export default ArtistHeader;
