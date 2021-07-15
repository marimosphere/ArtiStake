import Tip from "./Tip";
import { TipProps } from "./types";

const args: TipProps = {
  artistWalletAddress: "0x84E9445f43995b0C6a4D4C1d40bb123571c2Eb06",
};

export default {
  title: "Tip",
  component: Tip,
  args,
};

export const Default: React.FC<TipProps> = (props) => <Tip {...props} />;
