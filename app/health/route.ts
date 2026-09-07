import { createClient } from "@/lib/supabase/server";

export async function GET(): Promise<Response> {
  const supabase = await createClient();
  let dbStatus = "ok";

  try {
    const { error } = await supabase.from("technologies").select("id").limit(1);
    if (error) throw error;
  } catch {
    dbStatus = "error";
  }

  return Response.json(
    {
      service: "atom",
      status: dbStatus === "ok" ? "ok" : "degraded",
      db_status: dbStatus,
      version: 1,
    },
    {
      status: dbStatus === "ok" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
