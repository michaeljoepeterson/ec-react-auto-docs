"use client";

import { signIn, useSession } from "next-auth/react";

const SignInButton = () => {
  const { data: session } = useSession();

  console.log("SignInButton Session:", session);
  if (!session) {
    return (
      <div>
        <button onClick={() => signIn("google")}>Login with Google</button>
      </div>
    );
  }

  return null;
};

export default SignInButton;
