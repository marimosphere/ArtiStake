import * as React from "react";
import { ArtistHeaderProps } from "./types";

const ArtistHeader: React.FC<ArtistHeaderProps> = ({
  name,
  description,
  aboutMyWork,
  aboutMyWorkImage,
  avatar,
  bannar,
}) => {
  return (
    <div className="w-full mx-auto bg-marimo-1">
      <div className="flex pt-4 pb-8 grid lg:grid-cols-2">
        <div className="flex px-2 py-2 lg:px-8">
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
      <div className="bg-marimo-3 text-white">
        <p className="ml-8 text-lg py-1">About My Works</p>
      </div>
      {aboutMyWorkImage ? (
        <div className="flex grid lg:grid-cols-3 ">
          <p className="text-white text-sm p-8 lg:col-span-2">{aboutMyWork}</p>
          <div className="lg:col-span-1">
            <img className="mx-auto h-48 m-4" src={aboutMyWorkImage} />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-white text-sm p-8">{aboutMyWork}</p>
        </div>
      )}
    </div>
  );
};

export default ArtistHeader;
