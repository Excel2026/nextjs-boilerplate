// app/pick3/page.tsx
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/"); // send all /pick3 traffic to the root dashboard
}
