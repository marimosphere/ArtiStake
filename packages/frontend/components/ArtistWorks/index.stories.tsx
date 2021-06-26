import ArtistWorks from "./ArtistWorks";
import { ArtistWorksProps } from "./types";

const args: ArtistWorksProps = {
  walletAddress: "0x84E9445f43995b0C6a4D4C1d40bb123571c2Eb06",
  galleryTumbnail: "assets/img/artists/marimosphere/gallery.png",
  galleryUrl: "https://www.instagram.com/marimosphere/",
  shopTumbnail: "assets/img/artists/marimosphere/shop.png",
  shopUrl: "https://www.instagram.com/marimosphere/",
};

export default {
  title: "ArtistWorks",
  component: ArtistWorks,
  args,
};

export const Default: React.FC<ArtistWorksProps> = (props) => <ArtistWorks {...props} />;
