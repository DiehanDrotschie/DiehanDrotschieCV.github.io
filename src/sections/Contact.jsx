import { Box, Button, Container, Link, Stack, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Box id="contact" className="section-tight">
      <Container>
        <Box
          className="glass-card"
          sx={{
            p: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={1}>
            <Typography variant="h3">Let us build something solid.</Typography>
            <Typography color="text.secondary">
              Reach out for collaborations, roles, or project discussions.
            </Typography>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              color="primary"
              href="mailto:diehandrotschie@gmail.com"
            >
              Email Me
            </Button>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href="https://www.linkedin.com/in/diehan-drotschie-168a781b3/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
