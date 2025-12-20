import { Button, ButtonProps } from "@mui/material";
import { signOut } from "next-auth/react";

const SignOutButton = ({ color }: { color?: ButtonProps["color"] }) => {
  return (
    <div>
      <Button color={color} onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  );
};

export default SignOutButton;
