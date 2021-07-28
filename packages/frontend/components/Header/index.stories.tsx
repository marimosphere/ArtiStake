import Header from "./Header";
import { HeaderProps } from "./types";

const args: HeaderProps = {
  isConnectWallet: true,
};

export default {
  title: "Header",
  component: Header,
  args,
};

export const Default: React.FC<HeaderProps> = (props) => <Header {...props} />;
