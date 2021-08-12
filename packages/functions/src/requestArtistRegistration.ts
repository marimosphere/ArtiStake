import { Octokit } from "@octokit/core";
import axios from "axios";

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN || "";
const GITHUB_ORG = process.env.GITHUB_ORG || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "";

const main = async (
  id: string,
  name: string,
  description: string,
  aboutMyWork: string,
  walletAddress: string,
  galleryUrl: string,
  shopUrl: string
) => {
  if (!GITHUB_ACCESS_TOKEN || !GITHUB_ORG || !GITHUB_REPO) {
    console.log("required env is not set");
    return;
  }
  const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
  const owner = GITHUB_ORG;
  const repo = GITHUB_REPO;

  const baseBranch = "main";

  // 現在のCommitのshaとtree_shaを取得する
  const getCommitsResponse = await octokit.request(`GET /repos/{owner}/{repo}/commits/${baseBranch}`, {
    owner: GITHUB_ORG,
    repo: GITHUB_REPO,
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

  const fileId = "1NGoOM7D57u4Ci4iblpBVh3zxTjAixiKL";
  const googleDriveBasePath = "https://drive.google.com/uc?id=";
  const res = await axios.get(`${googleDriveBasePath}${fileId}`, { responseType: "arraybuffer" });
  const imageContent = Buffer.from(res.data, "binary").toString("base64");

  const postImageBlobsResponse = await octokit.request("POST /repos/{owner}/{repo}/git/blobs", {
    owner,
    repo,
    content: imageContent,
    encoding: "base64",
  });
  const createdImageContentBlobSha = postImageBlobsResponse.data.sha;

  // BLOB作成
  const mdContent = `---
name: ${name}
description: ${description}
aboutMyWork: ${aboutMyWork}
walletAddress: ${walletAddress}
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

  // 現在のTree取得
  const getTreesResponse = await octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
    owner,
    repo,
    tree_sha: latestTreeSha,
  });
  const latestTree = getTreesResponse.data.tree;

  // 現在のtreeに追加するblobの追加
  // FIXME: avoid any
  const tree = latestTree.concat([
    {
      path: `${id}.md`,
      mode: "100644",
      type: "blob",
      sha: createdMdContentBlobSha,
    },
    {
      path: `${id}.png`,
      mode: "100644",
      type: "blob",
      sha: createdImageContentBlobSha,
    },
  ]) as any;

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

main(
  "taijusanagi-3",
  "真木大樹",
  "This is me",
  "This is my work",
  "0x000",
  "http://localhost:3000",
  "http://localhost:3000"
);
