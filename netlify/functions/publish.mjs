// Netlify Serverless Function: Publish product/brand data to GitHub
// This commits updated JSON files to the repo, triggering Netlify rebuild.
//
// Environment variables required (set in Netlify dashboard):
//   GITHUB_TOKEN  — Fine-grained PAT with Contents: Read+Write
//   GITHUB_REPO   — e.g. "username/yashada-enterprises"
//   GITHUB_BRANCH  — defaults to "master"
//   ADMIN_PUBLISH_SECRET — shared secret to prevent unauthorized publishes

export default async function handler(req, context) {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate shared secret
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH = 'master', ADMIN_PUBLISH_SECRET } = process.env;
  
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return new Response(JSON.stringify({ error: 'Server not configured. Add GITHUB_TOKEN and GITHUB_REPO to Netlify env vars.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json();
  
  // Check authorization
  if (ADMIN_PUBLISH_SECRET && body.secret !== ADMIN_PUBLISH_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { products, brands } = body;

  if (!products || !brands) {
    return new Response(JSON.stringify({ error: 'Missing products or brands data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const githubApi = `https://api.github.com/repos/${GITHUB_REPO}`;
  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    // Step 1: Get the latest commit SHA on the branch
    const refRes = await fetch(`${githubApi}/git/ref/heads/${GITHUB_BRANCH}`, { headers });
    if (!refRes.ok) throw new Error(`Failed to get branch ref: ${refRes.status}`);
    const refData = await refRes.json();
    const latestCommitSha = refData.object.sha;

    // Step 2: Get the tree of the latest commit
    const commitRes = await fetch(`${githubApi}/git/commits/${latestCommitSha}`, { headers });
    if (!commitRes.ok) throw new Error(`Failed to get commit: ${commitRes.status}`);
    const commitData = await commitRes.json();
    const baseTreeSha = commitData.tree.sha;

    // Step 3: Create blobs for both files
    const createBlob = async (content) => {
      const blobRes = await fetch(`${githubApi}/git/blobs`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: JSON.stringify(content, null, 2), encoding: 'utf-8' }),
      });
      if (!blobRes.ok) throw new Error(`Failed to create blob: ${blobRes.status}`);
      return (await blobRes.json()).sha;
    };

    const productsBlobSha = await createBlob(products);
    const brandsBlobSha = await createBlob(brands);

    // Step 4: Create a new tree with both updated files
    const treeRes = await fetch(`${githubApi}/git/trees`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: [
          { path: 'src/data/products.json', mode: '100644', type: 'blob', sha: productsBlobSha },
          { path: 'src/data/brands.json', mode: '100644', type: 'blob', sha: brandsBlobSha },
        ],
      }),
    });
    if (!treeRes.ok) throw new Error(`Failed to create tree: ${treeRes.status}`);
    const treeData = await treeRes.json();

    // Step 5: Create a new commit
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const newCommitRes = await fetch(`${githubApi}/git/commits`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `📦 Update products & brands — ${now}`,
        tree: treeData.sha,
        parents: [latestCommitSha],
      }),
    });
    if (!newCommitRes.ok) throw new Error(`Failed to create commit: ${newCommitRes.status}`);
    const newCommitData = await newCommitRes.json();

    // Step 6: Update the branch reference to point to the new commit
    const updateRefRes = await fetch(`${githubApi}/git/refs/heads/${GITHUB_BRANCH}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sha: newCommitData.sha }),
    });
    if (!updateRefRes.ok) throw new Error(`Failed to update ref: ${updateRefRes.status}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Published! Site will rebuild in ~60 seconds.',
      commitSha: newCommitData.sha.slice(0, 7),
      commitUrl: newCommitData.html_url,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Publish error:', err);
    return new Response(JSON.stringify({
      error: `Publish failed: ${err.message}`,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  path: '/api/publish',
};
