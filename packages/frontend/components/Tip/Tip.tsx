import * as React from "react";
import { ArtistWorksProps } from "./types";

const Tip = () => {
  const [tipStatus, setTipStatus] = React.useState<"approve" | "tip" | "confirm">("approve");

  const approve = () => {
    setTipStatus("tip");
  };

  const tip = () => {
    setTipStatus("confirm");
  };

  return (
    <div className="w-full mx-auto">
      <img className="mx-auto h-40 object-cover mb-8" src="assets/img/artists/takumi/jpyc.png" />
      {tipStatus === "approve" ? (
        <div className="text-center">
          <input type="number" className="mr-8 h-8 rounded text-right" />
          <button
            onClick={approve}
            className="w-24 h-10 bg-pink-500 hover:opacity-75 text-white font-bold py-2 px-4 rounded"
          >
            Approve
          </button>
        </div>
      ) : tipStatus === "tip" ? (
        <div className="text-center">
          <input type="number" className="mr-8 h-8 rounded text-right" />
          <button
            onClick={tip}
            className="bg-pink-500 hover:opacity-75 text-white font-bold py-2 px-4 rounded w-24 h-10"
          >
            Tip
          </button>
        </div>
      ) : (
        <div className="">
          <p className="text-white  text-base text-center">
            Thank you!{" "}
            <a href="#" className="underline">
              Receipt
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Tip;
