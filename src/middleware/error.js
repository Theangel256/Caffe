export async function onError({ error, request }) {
  console.error("🚨 Global Error:", error);

  // Option 1: JSON response (for API errors)
  if (request.headers.get("accept")?.includes("application/json")) {
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
