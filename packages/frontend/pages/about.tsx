import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Footer } from "../components/Footer";
const AboutPage = () => {
  return (
    <div>
      <Header isConnectWallet={false} />
      <Hero />
      <About />
      <Footer />
    </div>
  );
};

export default AboutPage;
