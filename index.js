// index.js – no OpenAI version

export default {
  async scheduled(event, env, ctx) {
    await doReferralSignup(env);
  },
  async fetch(req) {
    return new Response("Bot live (no OpenAI).");
  }
};

async function doReferralSignup(env) {
  try {
    // Login to Mail.tm
    const loginRes = await fetch("https://api.mail.tm/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: env.MAILTM_EMAIL,
        password: env.MAILTM_PASSWORD
      })
    });
    if (!loginRes.ok) {
      console.log("Mail.tm login failed:", loginRes.status);
      return;
    }
    const { token } = await loginRes.json();

    // Generate a unique alias using plus addressing
    const suffix = Math.random().toString(36).slice(2, 8);
    const emailAddress = env.MAILTM_EMAIL.replace("@", `+${suffix}@`);

    const firstNames = ["Liam","Noah","Mason","Ava","Emma","Mia"];
    const lastNames = ["Smith","Brown","Miller","Jones","Wilson","Taylor"];
    const fullName = `${pick(firstNames)} ${pick(lastNames)}`;
    const password = "Pass" + suffix + "!";

    // TODO: Replace this with a real referral signup request.
    console.log("Created signup profile:", emailAddress, fullName, password);

    // Poll inbox (simple fetch just to show it works)
    const messagesRes = await fetch("https://api.mail.tm/messages", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await messagesRes.json();
    console.log("Inbox message count:", data["hydra:totalItems"]);
  } catch (e) {
    console.log("Referral error:", e.toString());
  }
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
