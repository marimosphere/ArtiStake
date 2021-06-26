import ArtistCard from "./ArtistCard";
import { ArtistCardProps } from "./types";

const args: ArtistCardProps = {
  index: 0,
  name: "Marimosphere",
  description: "Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR",
  avatar: "assets/img/artists/marimosphere/avatar.png",
  thumbnail: "assets/img/artists/marimosphere/thumbnail.png",
};

export default {
  title: "ArtistCard",
  component: ArtistCard,
  args,
};

export const Default: React.FC<ArtistCardProps> = (props) => <ArtistCard {...props} />;
