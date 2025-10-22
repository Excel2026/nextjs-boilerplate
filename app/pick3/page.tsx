// app/pick3/page.tsx
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/"); // redirect all /pick3 traffic to root
}
