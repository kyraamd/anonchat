import fetch from "node-fetch";

const REPO_OWNER = process.env.GITHUB_USER;
const REPO_NAME = process.env.GITHUB_REPO;
const FILE_PATH = "messages.json";
const TOKEN = process.env.GITHUB_TOKEN;

async function getFileSha() {
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
    headers: { Authorization: `token ${TOKEN}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha;
}

export async function fetchMessages() {
  const res = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}`);
  if (!res.ok) return [];
  return await res.json();
}

export async function saveMessages(messages) {
  const sha = await getFileSha();
  await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update messages",
      content: Buffer.from(JSON.stringify(messages, null, 2)).toString("base64"),
      sha
    })
  });
}
