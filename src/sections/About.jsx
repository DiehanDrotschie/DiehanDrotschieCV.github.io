import { Box, Container, Grid, Stack, Typography } from "@mui/material";

export default function About() {
    return (
        <Box id="about" className="section-tight">
            <Container>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                            <Typography variant="h2">Summary</Typography>
                            <Typography color="text.secondary">
                                Demonstrated ability to excel in both academic
                                and practical settings, with experience
                                developing robust software solutions and
                                contributing to real-world projects. Proficient
                                across multiple languages and frameworks, with a
                                strong drive to keep improving.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack
                            spacing={2}
                            className="glass-card"
                            sx={{ p: 3, borderRadius: 4 }}
                        >
                            <Typography variant="h3">About Me</Typography>
                            <Grid container spacing={1}>
                                {[
                                    ["Nationality", "South African"],
                                    ["Age", "22 yrs"],
                                    ["Sex", "Male"],
                                ].map(([label, value]) => (
                                    <Grid item xs={12} sm={6} key={label}>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                        >
                                            {label}
                                        </Typography>
                                        <Typography variant="body1">
                                            {value}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
