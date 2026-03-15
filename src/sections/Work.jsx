import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

export default function Work({ projects }) {
  return (
    <Box id="work" className="section">
      <Container>
        <Stack spacing={4}>
          <Typography variant="h2">Portfolio</Typography>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} md={6} key={project.title}>
                <Card className="glass-card" sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={project.images[0]}
                    alt={project.title}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="h4">{project.title}</Typography>
                      <Typography color="text.secondary">
                        {project.description}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {project.images.slice(1).map((image) => (
                          <Box
                            key={image}
                            component="img"
                            src={image}
                            alt={`${project.title} preview`}
                            sx={{
                              width: 72,
                              height: 72,
                              borderRadius: 2,
                              objectFit: "cover",
                              border: "1px solid rgba(29, 27, 22, 0.08)",
                            }}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
