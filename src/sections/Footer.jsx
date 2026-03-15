import { Box, Container, Divider, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          (c) 2026 Diehan Drotschie. Built with React and Material UI.
        </Typography>
      </Container>
    </Box>
  );
}
