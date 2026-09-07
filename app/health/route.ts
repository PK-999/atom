export async function GET(): Promise<Response> {
  return Response.json(
    {
      service: "atom",
      status: "ok",
      version: 1,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
