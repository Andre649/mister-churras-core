// test-otp.js
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dGVzanJldmd4bWZjdW13eHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODg4MjYsImV4cCI6MjA5Mzk2NDgyNn0.sO9bQb0huywhRjg2ibc09wG2niUdAIsNqJR9Q9XfLf0";
const URL = "https://swtesjrevgxmfcumwxra.supabase.co/functions/v1/send-whatsapp-otp";

async function run() {
  console.log("Calling Supabase Send WhatsApp OTP function...");
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ANON_KEY}`
    },
    body: JSON.stringify({ phone: "551199999999" })
  });
  
  const text = await res.text();
  console.log("HTTP Status:", res.status);
  console.log("Response:", text);
}

run().catch(console.error);
