import { Octokit } from "@octokit/core";
import axios from "axios";

interface Config {
  auth: string;
  owner: string;
  repo: string;
}

// FIXME: パフォーマンスを上げるためにいくつかの処理を並行で動かすことができるが
// そこまで厳密に効率を求めた実装していない、動いていればOK
const main = async (
  id: string,
  name: string,
  description: string,
  aboutMyWork: string,
  walletAddress: string,
  avatar: string,
  thumbnail: string,
  banner: string,
  gallery: string,
  shop: string,
  galleryUrl: string,
  shopUrl: string,
  config: Config
): Promise<void> => {
  const octokit = new Octokit({ auth: config.auth });
  const owner = config.owner;
  const repo = config.repo;

  const baseBranch = "main";

  // 現在のCommitのshaとtree_shaを取得する
  const getCommitsResponse = await octokit.request(`GET /repos/{owner}/{repo}/commits/${baseBranch}`, {
    owner,
    repo,
  });
  const latestTreeSha = getCommitsResponse.data.commit.tree.sha;
  const latestCommitSha = getCommitsResponse.data.sha;

  // Branch作成
  const headBranch = `create-${id}`;
  const ref = `heads/${headBranch}`;
  await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner,
    repo,
    ref: `refs/${ref}`,
    sha: latestCommitSha,
  });

  // MDファイルのBLOB作成
  const mdContent = `---
    name: ${name}
    description: ${description}
    aboutMyWork: ${aboutMyWork}
    walletAddress: ${walletAddress}
    avatar: "/assets/img/artists/${id}/avatar.png"
    thumbnail: "/assets/img/artists/${id}/thumbnail.png"
    banner: "/assets/img/artists/${id}/banner.png"
    galleryTumbnail: "/assets/img/artists/${id}/gallery.png"
    shopTumbnail: "/assets/img/artists/${id}/shop.png"
    galleryUrl: ${galleryUrl}
    shopUrl: ${shopUrl}
    ---
      `;
  const postMdBlobsResponse = await octokit.request("POST /repos/{owner}/{repo}/git/blobs", {
    owner,
    repo,
    content: mdContent,
    encoding: "utf-8",
  });
  const createdMdContentBlobSha = postMdBlobsResponse.data.sha;

  // 画像ファイルのBLOB作成
  // This order cannot be changed
  const images = [avatar, thumbnail, banner, gallery, shop];
  const imagesFileName = ["avatar", "thumbnail", "banner", "gallery", "shop"];

  const googleDriveBasePath = "https://drive.google.com/uc?id=";
  const imageResponses = await Promise.all(
    images.map((image) => {
      return axios.get(`${googleDriveBasePath}${image}`, { responseType: "arraybuffer" });
    })
  );
  const postImageBlobsResponses = await Promise.all(
    imageResponses.map((imageResponse) => {
      const imageContent = Buffer.from(imageResponse.data, "binary").toString("base64");
      return octokit.request("POST /repos/{owner}/{repo}/git/blobs", {
        owner,
        repo,
        content: imageContent,
        encoding: "base64",
      });
    })
  );

  // 現在のTree取得
  const getTreesResponse = await octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
    owner,
    repo,
    tree_sha: latestTreeSha,
  });
  const latestTree = getTreesResponse.data.tree;

  const imageTrees = postImageBlobsResponses.map((postImageBlobsResponse, i) => {
    return {
      path: `packages/frontend/public/assets/img/artists/${imagesFileName[i]}.png`,
      mode: "100644",
      type: "blob",
      sha: postImageBlobsResponse.data.sha,
    };
  });

  // 現在のtreeに追加するblobの追加
  // FIXME: avoid any
  const tree = latestTree
    .concat([
      {
        path: `packages/frontend/artists/${id}.md`,
        mode: "100644",
        type: "blob",
        sha: createdMdContentBlobSha,
      },
    ])
    .concat(imageTrees) as any;

  // Tree更新
  const postTreesResponse = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
    owner,
    repo,
    tree,
  });
  const updatedTreeSha = postTreesResponse.data.sha;

  // Commit作成
  const postCommitsResponse = await octokit.request("POST /repos/{owner}/{repo}/git/commits", {
    owner,
    repo,
    message: "create",
    parents: [latestCommitSha],
    tree: updatedTreeSha,
  });

  const updatedCommitSha = postCommitsResponse.data.sha;

  // Remote更新
  await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
    owner,
    repo,
    ref,
    sha: updatedCommitSha,
  });

  // PR作成
  await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner,
    repo,
    title: `${id} の作成`,
    head: headBranch,
    base: baseBranch,
  });
};

export default main;
