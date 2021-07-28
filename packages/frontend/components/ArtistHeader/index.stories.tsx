import ArtistHeader from "./ArtistHeader";
import { ArtistHeaderProps } from "./types";

const args: ArtistHeaderProps = {
  name: "Marimosphere",
  description: "Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR",
  aboutMyWork:
    "Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR. Crypto Artist, Visual Artist, VJ, Projection Mapping, Dome Visual, VR.",
  avatar: "assets/img/artists/marimosphere/avatar.png",
  banner: "assets/img/artists/marimosphere/banner.png",
};

export default {
  title: "ArtistHeader",
  component: ArtistHeader,
  args,
};

export const Default: React.FC<ArtistHeaderProps> = (props) => <ArtistHeader {...props} />;
