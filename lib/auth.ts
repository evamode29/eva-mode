import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileRole = "customer" | "admin";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: ProfileRole }>();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return { user, profile };
}
