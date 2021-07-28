import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { About } from "../components/About";

const AboutPage = () => {
  return (
    <div>
      <Header isConnectWallet={false} />
      <Hero />
      <About />
    </div>
  );
};

export default AboutPage;
