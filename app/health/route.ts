export function GET(): Response {
  return Response.json(
    {
      service: "atom",
      status: "ok",
      version: 1,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
