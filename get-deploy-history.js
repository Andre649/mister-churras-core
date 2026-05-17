// get-deploy-history.js
const RENDER_TOKEN = "rnd_wKXTspS9ypQX6jO9zdLzx2AeTB2B";
const SERVICE_ID = "srv-d84qhtv7f7vs73a9o2m0";

async function run() {
  console.log("Fetching Render deploys history...");
  const res = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/deploys?limit=5`, {
    headers: {
      "Authorization": `Bearer ${RENDER_TOKEN}`,
      "Accept": "application/json"
    }
  });
  
  if (res.ok) {
    const deploys = await res.json();
    console.log(JSON.stringify(deploys, null, 2));
  } else {
    console.log("Failed:", res.status, await res.text());
  }
}

run().catch(console.error);
