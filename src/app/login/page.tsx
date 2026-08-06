import { AuthProvider } from "@/components/cms/AuthProvider";
import LoginForm from "@/components/cms/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
