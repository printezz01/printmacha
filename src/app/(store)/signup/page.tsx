import { redirect } from "next/navigation";

// OTP login handles both new and existing users — no separate signup needed
export default function SignupPage() {
  redirect("/login");
}
