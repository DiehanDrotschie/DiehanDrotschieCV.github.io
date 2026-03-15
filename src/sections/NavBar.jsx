import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar({ navItems }) {
  const [open, setOpen] = useState(false);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(247, 243, 238, 0.85)",
        color: "text.primary",
        borderBottom: "1px solid rgba(29, 27, 22, 0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Diehan Drotschie
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
          {navItems.map((item) => (
            <Button key={item.href} href={item.href} color="inherit">
              {item.label}
            </Button>
          ))}
        </Stack>
        <Button
          variant="contained"
          color="primary"
          href="/DiehanCV.pdf"
          target="_blank"
          rel="noreferrer"
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          Download CV
        </Button>
      </Toolbar>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Navigate
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                component="a"
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            href="/DiehanCV.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Download CV
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}
