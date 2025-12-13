"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  if (!session) {
    return <button onClick={() => signIn("google")}>Login with Google</button>;
  }

  return (
    <>
      <p>Signed in as {session.user?.email}</p>
      <button onClick={() => signOut()}>Logout</button>
      {/* <button onClick={() => fetch("/api/drive/list")}>List Drive Files</button>
      <button onClick={() => signOut()}>Logout</button> */}
    </>
  );
}
