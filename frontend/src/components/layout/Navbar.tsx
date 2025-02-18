import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import Logo from "./Logo";

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  return (
    <AppBar position="fixed" className="bg-primary">
      <Toolbar className="justify-between">
        <Box className="flex items-center gap-2">
          <Logo />
          <Typography variant="h6" className="font-bold">
            College ERP
          </Typography>
        </Box>
        <Button color="inherit" onClick={onLoginClick}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
