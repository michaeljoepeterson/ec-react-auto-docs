"use client";

import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SignOutButton from "./auth/SignOutButton";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            EC Auto Docs
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={() => toggleDrawer(false)}>
        <div className="w-[50vw] md:w-[25vw]">
          <SignOutButton />
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
