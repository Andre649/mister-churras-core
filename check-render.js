// check-render.js
const RENDER_TOKEN = "rnd_wKXTspS9ypQX6jO9zdLzx2AeTB2B";

async function run() {
  console.log("Fetching Render services status...");
  const res = await fetch("https://api.render.com/v1/services?limit=5", {
    headers: {
      "Authorization": `Bearer ${RENDER_TOKEN}`,
      "Accept": "application/json"
    }
  });
  
  if (!res.ok) {
    console.error("HTTP Error:", res.status, await res.text());
    return;
  }
  
  const services = await res.json();
  for (const s of services) {
    const svc = s.service;
    console.log(`\nService: ${svc.name} (${svc.id})`);
    console.log(`URL: ${svc.url}`);
    console.log(`Status: ${svc.status}`);
    console.log(`Updated At: ${svc.updatedAt}`);
    
    // Fetch last deploy
    const dRes = await fetch(`https://api.render.com/v1/services/${svc.id}/deploys?limit=1`, {
      headers: {
        "Authorization": `Bearer ${RENDER_TOKEN}`,
        "Accept": "application/json"
      }
    });
    if (dRes.ok) {
      const deploys = await dRes.json();
      if (deploys.length > 0) {
        console.log(`Last Deploy Status: ${deploys[0].deploy.status}`);
        console.log(`Last Deploy Trigger: ${deploys[0].deploy.trigger}`);
      }
    }
  }
}

run().catch(console.error);
