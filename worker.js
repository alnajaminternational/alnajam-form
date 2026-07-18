export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Proxy form submissions to GAS with authentication
    if (url.pathname === "/submit" && request.method === "POST") {
      return handleSubmit(request, env);
    }

    // Serve static React app for all other routes
    return env.ASSETS.fetch(request);
  },
};

async function getAccessToken(env) {
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error("Token refresh failed: " + text);
  }
  const { access_token } = await resp.json();
  if (!access_token) throw new Error("No access token returned");
  return access_token;
}

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwn-SQ9VTMC0I8WiWdE-gP5e0enO63biijNwCPV4fJZ6UGgZQ4HnSR0hNZm-ch9YdKr7A/exec";

async function handleSubmit(request, env) {
  try {
    const body = await request.text();
    const accessToken = await getAccessToken(env);

    const gasResp = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    const text = await gasResp.text();

    if (!gasResp.ok) {
      return new Response(
        JSON.stringify({ success: false, error: "Server error " + gasResp.status }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
