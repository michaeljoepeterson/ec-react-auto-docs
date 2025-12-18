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
  return (
    <>
      {children}
      <p>To do remove Signed in as {session.user?.email}</p>
      <div>
        <button onClick={() => fetch("/api/drive/list")}>
          List Drive Files
        </button>
      </div>
      <div>
        <button onClick={() => fetch("/api/drive/test-doc")}>
          Create test doc
        </button>
      </div>
      <SignOutButton />
    </>
  );
};
export default AuthProvider;
