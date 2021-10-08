import * as React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { ArtistHeaderProps } from "./types";

const ArtistHeader: React.FC<ArtistHeaderProps> = ({ name, description, aboutMyWork, mywork, avatar, banner }) => {
  return (
    <div className="w-full mx-auto bg-marimo-1">
      <div className="flex pt-4 pb-8 grid lg:grid-cols-2">
        <div className="flex px-2 py-2 lg:px-8">
          <div>
            <img className="w-40 rounded-full" src={avatar} />
          </div>
          <div className="ml-4">
            <p className="text-white text-2xl mb-2">{name}</p>
            <p className="text-white text-md">{description}</p>
          </div>
        </div>
        <div>
          <img className="w-full h-48 object-cover" src={banner} />
        </div>
      </div>
      <div className="bg-marimo-3 text-white">
        <p className="ml-8 text-lg py-1">About My Works</p>
      </div>
      {mywork ? (
        <div className="flex grid lg:grid-cols-5 ">
          <p className="about-my-work text-white text-md p-8 lg:col-span-3">{aboutMyWork}</p>
          <div className="lg:col-span-2">
            <Zoom overlayBgColorEnd={"rgba(28, 32, 60, 0.95)"}>
              <img className="mx-auto m-4 max-h-96" src={mywork} />
            </Zoom>
          </div>
        </div>
      ) : (
        <div>
          <p className="about-my-work text-white text-md p-8">{aboutMyWork}</p>
        </div>
      )}
    </div>
  );
};

export default ArtistHeader;
