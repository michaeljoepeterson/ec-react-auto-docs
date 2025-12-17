import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <div>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
};

export default SignOutButton;
