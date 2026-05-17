// poll-deploy.js
const RENDER_TOKEN = "rnd_wKXTspS9ypQX6jO9zdLzx2AeTB2B";
const SERVICE_ID = "srv-d84qhtv7f7vs73a9o2m0";

async function run() {
  console.log("Polling Render deployment status...");
  
  while (true) {
    const res = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/deploys?limit=1`, {
      headers: {
        "Authorization": `Bearer ${RENDER_TOKEN}`,
        "Accept": "application/json"
      }
    });
    
    if (!res.ok) {
      console.error("HTTP Error:", res.status, await res.text());
      break;
    }
    
    const deploys = await res.json();
    if (deploys.length === 0) {
      console.log("No deploys found.");
      break;
    }
    
    const deploy = deploys[0].deploy;
    console.log(`[${new Date().toLocaleTimeString()}] Status: ${deploy.status} | Commit: ${deploy.commit?.message?.substring(0, 50)}`);
    
    if (deploy.status === "live") {
      console.log("\n🎉 DEPLOY COMPLETED SUCCESSFULLY! Service is online!");
      break;
    }
    
    if (deploy.status === "build_failed" || deploy.status === "canceled") {
      console.log("\n❌ DEPLOY FAILED OR CANCELED.");
      break;
    }
    
    // Wait 20 seconds
    await new Promise(resolve => setTimeout(resolve, 20000));
  }
}

run().catch(console.error);
