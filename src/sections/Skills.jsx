import { Box, Chip, Container, Stack, Typography } from "@mui/material";

export default function Skills({ skills }) {
  return (
    <Box id="skills" className="section">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h2">Programming Languages</Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            {skills.map((skill) => (
              <Chip key={skill} label={skill} sx={{ mb: 1 }} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
