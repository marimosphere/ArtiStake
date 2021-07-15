import Stake from "./Stake";
import { StakeProps } from "./types";

const args: StakeProps = {
  artistWalletAddress: "0x84E9445f43995b0C6a4D4C1d40bb123571c2Eb06",
};

export default {
  title: "Stake",
  component: Stake,
  args,
};

export const Default: React.FC<StakeProps> = (props) => <Stake {...props} />;
