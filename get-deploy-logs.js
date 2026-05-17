// get-deploy-logs.js
const RENDER_TOKEN = "rnd_wKXTspS9ypQX6jO9zdLzx2AeTB2B";
const SERVICE_ID = "srv-d84qhtv7f7vs73a9o2m0";

async function run() {
  console.log("Fetching Service details...");
  const sRes = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}`, {
    headers: {
      "Authorization": `Bearer ${RENDER_TOKEN}`,
      "Accept": "application/json"
    }
  });
  
  if (sRes.ok) {
    const sData = await sRes.json();
    console.log(JSON.stringify(sData, null, 2));
  } else {
    console.log("Failed to fetch service details:", sRes.status, await sRes.text());
  }
}

run().catch(console.error);
