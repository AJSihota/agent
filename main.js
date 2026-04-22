import { RetellWebClient } from "retell-client-sdk";

const client = new RetellWebClient();
let activeDemo = null;

client.on("call_started", () => {
  console.log("Call started");
});

client.on("call_ended", () => {
  console.log("Call ended");
  activeDemo = null;
  resetButtons();
});

client.on("error", (err) => {
  console.error("Call error:", err);
  activeDemo = null;
  resetButtons();
});

window.startCall = async function(demo) {
  const btn = document.getElementById("btn-" + demo);

  if (activeDemo === demo) {
    client.stopCall();
    activeDemo = null;
    resetButtons();
    return;
  }

  if (activeDemo) {
    client.stopCall();
  }

  try {
    btn.textContent = "🔄 Connecting...";
    btn.disabled = true;
    activeDemo = demo;

    const res = await fetch("/api/create-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demo }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create call");

    await client.startCall({
      callId: data.call_id,
      accessToken: data.access_token,
    });

    btn.textContent = "🔴 End Call";
    btn.disabled = false;
    btn.style.background = "#e53935";

  } catch (err) {
    console.error("Failed to start call:", err);
    alert("Could not start call. Please try again.");
    activeDemo = null;
    resetButtons();
  }
};

function resetButtons() {
  ["ev", "crypto"].forEach((demo) => {
    const btn = document.getElementById("btn-" + demo);
    if (btn) {
      btn.textContent = "📞 Call Now";
      btn.disabled = false;
      btn.style.background = "";
    }
  });
}
