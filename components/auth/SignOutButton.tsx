import { Button, ButtonProps } from "@mui/material";
import { signOut } from "next-auth/react";

const SignOutButton = ({ colour }: { colour?: ButtonProps["color"] }) => {
  return (
    <div>
      <Button color={colour} onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  );
};

export default SignOutButton;
