import * as React from "react";

const Tip = () => {
  const [tipStatus, setTipStatus] = React.useState<"approve" | "tip" | "confirm">("approve");

  const approve = () => {
    setTipStatus("tip");
  };

  const tip = () => {
    setTipStatus("confirm");
  };

  return (
    <div className="">
      <div>JPYC logo</div>
      {tipStatus === "approve" ? (
        <div>
          <input type="number" />
          <button onClick={approve}>Approve</button>
        </div>
      ) : tipStatus === "tip" ? (
        <div>
          <input type="number" />
          <button onClick={tip}>Tip</button>
        </div>
      ) : (
        <div>
          <p>Thank you!</p>
          <p>
            <a href="#">TX HASH</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Tip;
