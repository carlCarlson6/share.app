export async function POST(request: Request) {
  const body = await request.json();
  console.log("headers", request.headers);
  console.log("body", body);

  return new Response("ok", { status: 200,})
}
//   const { type, data } = body;