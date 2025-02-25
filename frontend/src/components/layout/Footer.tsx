import React from "react";
import { useTheme as useMUITheme } from "@mui/material/styles";
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer: React.FC = () => {
  const theme = useMUITheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 1.5,
        px: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#ffffff",
        color: theme.palette.text.secondary,
        backdropFilter: "blur(20px)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Container maxWidth={false}>
        <Grid container alignItems="center" spacing={2}>
          {/* Logo and Copyright */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src="/logo.svg"
                alt="Logo"
                sx={{
                  height: 20,
                  filter:
                    theme.palette.mode === "dark"
                      ? "invert(0.85) hue-rotate(180deg) contrast(0.8) saturate(1.2)"
                      : "none",
                  transition: "filter 0.3s ease",
                  "&:hover": {
                    filter:
                      theme.palette.mode === "dark"
                        ? "invert(1) hue-rotate(180deg) contrast(0.9) saturate(1.2)"
                        : "brightness(1.1)",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                }}
              >
                © 2024 SynchronikERP
              </Typography>
            </Stack>
          </Grid>

          {/* Links */}
          <Grid item xs={12} md={4}>
            <Stack
              direction="row"
              spacing={2}
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.12)"
                        : "rgba(0, 0, 0, 0.12)",
                  }}
                />
              }
              justifyContent="center"
            >
              {["Privacy", "Terms", "Support"].map((text) => (
                <Link
                  key={text}
                  href="#"
                  underline="hover"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  <Typography variant="body2">{text}</Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Social Icons */}
          <Grid item xs={12} md={4}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "center", md: "flex-end" }}
            >
              {[
                { icon: <GitHubIcon fontSize="small" />, url: "#" },
                { icon: <LinkedInIcon fontSize="small" />, url: "#" },
                { icon: <TwitterIcon fontSize="small" />, url: "#" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.url}
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: theme.palette.primary.main,
                      transform: "translateY(-2px)",
                    },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {social.icon}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
