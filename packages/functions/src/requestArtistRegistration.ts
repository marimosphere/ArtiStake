import { Octokit } from "@octokit/core";

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
  const encoding = "utf-8";

  // TODO: Branch作成

  // BLOB作成
  const content = `---
name: ${name}
description: ${description}
aboutMyWork: ${aboutMyWork}
walletAddress: ${walletAddress}
galleryUrl: ${galleryUrl}
shopUrl: ${shopUrl}
---
  `;
  const postBlobsResponse = await octokit.request("POST /repos/{owner}/{repo}/git/blobs", {
    owner,
    repo,
    content,
    encoding,
  });
  const createdContentBlobSha = postBlobsResponse.data.sha;

  // 現在のCommitのshaとtree_shaを取得する
  const getCommitsResponse = await octokit.request("GET /repos/{owner}/{repo}/commits/main", {
    owner: GITHUB_ORG,
    repo: GITHUB_REPO,
  });
  const latestTreeSha = getCommitsResponse.data.commit.tree.sha;
  const latestCommitSha = getCommitsResponse.data.sha;

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
      sha: createdContentBlobSha,
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
  const patchCommitsResponse = await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
    owner,
    repo,
    ref: "heads/main",
    sha: updatedCommitSha,
  });
  console.log(patchCommitsResponse);

  // PR作成
};

main(
  "taijusanagi",
  "真木大樹",
  "This is me",
  "This is my work",
  "0x000",
  "http://localhost:3000",
  "http://localhost:3000"
);
