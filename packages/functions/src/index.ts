import * as functions from "firebase-functions";
import requestArtistRegistration from "./lib/requestArtistRegistration";

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN || "";
const GITHUB_ORG = process.env.GITHUB_ORG || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "";

export const createArtist = functions.region("asia-northeast1").https.onRequest(async (request, response) => {
  // TODO: 最低限の認証
  if (!GITHUB_ACCESS_TOKEN || !GITHUB_ORG || !GITHUB_REPO) {
    console.log("required env is not set");
    response.send("required env is not set");
    return;
  }
  const {
    id,
    name,
    description,
    aboutMyWork,
    walletAddress,
    avatar,
    thumbnail,
    banner,
    gallery,
    shop,
    galleryUrl,
    shopUrl,
  } = request.body;
  if (
    !id ||
    !name ||
    !description ||
    !aboutMyWork ||
    !walletAddress ||
    !avatar ||
    !thumbnail ||
    !banner ||
    !gallery ||
    !shop ||
    !galleryUrl ||
    !shopUrl
  ) {
    console.log(
      "Some value is missing",
      id,
      name,
      description,
      aboutMyWork,
      walletAddress,
      avatar,
      thumbnail,
      banner,
      gallery,
      shop,
      galleryUrl,
      shopUrl
    );
    response.send("Some value is missing");
    return;
  }
  await requestArtistRegistration(
    id,
    name,
    description,
    aboutMyWork,
    walletAddress,
    avatar,
    thumbnail,
    banner,
    gallery,
    shop,
    galleryUrl,
    shopUrl,
    {
      auth: GITHUB_ACCESS_TOKEN,
      owner: GITHUB_ORG,
      repo: GITHUB_REPO,
    }
  );
  response.send("Artist is registered");
  return;
});
