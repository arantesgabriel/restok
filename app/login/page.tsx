import dynamic from "next/dynamic";
import { LoginForm } from "@/app/login/login-form";

const LoginShowcase = dynamic(
  () => import("@/components/login-showcase/login-showcase").then((mod) => mod.LoginShowcase),
  { loading: () => <aside className="login-showcase" aria-hidden="true" /> },
);

export default function LoginPage() {
  return (
    <div className="login-page">
      <LoginForm />
      <LoginShowcase />
    </div>
  );
}
