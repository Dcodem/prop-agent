import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <SidebarNav />
      <TopBar />
      <main className="ml-64 pt-16 min-h-screen">{children}</main>
    </>
  );
}
