import SignOutButton from "@/components/auth/SignOutButton";
import SignInButton from "../components/auth/SignInButton";
import { useSession } from "next-auth/react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return null;
  }
  if (!session) {
    return <SignInButton />;
  }
  return <>{children}</>;
};
export default AuthProvider;
