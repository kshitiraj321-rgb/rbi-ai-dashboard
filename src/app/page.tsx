import { supabase } from "@/lib/supabase";
import Dashboard from "./components/Dashboard";

export default async function Home() {
  const { data } = await supabase
    .from("current_affairs")
    .select("*")
    .order("created_at", { ascending: false });

  return <Dashboard articles={data || []} />;
}