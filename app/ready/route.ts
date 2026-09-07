import { createClient } from "@/lib/supabase/server";

const READINESS_TIMEOUT_MS = 2000;

export async function GET(): Promise<Response> {
  try {
    const checkReadiness = async () => {
      const supabase = await createClient();
      const { error } = await supabase
        .from("technologies")
        .select("id")
        .limit(1);
      if (error) throw error;
    };

    let timer: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error("Database readiness probe timed out")),
        READINESS_TIMEOUT_MS,
      );
    });

    try {
      await Promise.race([checkReadiness(), timeoutPromise]);
    } finally {
      if (timer) clearTimeout(timer);
    }

    return Response.json(
      {
        service: "atom",
        status: "ready",
        db: "connected",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    // Redact all internal error details and sensitive information
    return Response.json(
      {
        service: "atom",
        status: "unavailable",
        db: "disconnected",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
