import {
    Box,
    Button,
    Chip,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

export default function Hero() {
    return (
        <Box className="section">
            <Container>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Stack spacing={3}>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: "secondary.main",
                                    letterSpacing: 2,
                                }}
                            >
                                Software Developer
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{ fontSize: { xs: 40, md: 64 } }}
                            >
                                Building clean, dependable software with a
                                data-informed mindset.
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ color: "text.secondary", maxWidth: 560 }}
                            >
                                Dedicated and proactive software developer with
                                a strong foundation in software engineering
                                principles, real-world project experience, and a
                                commitment to continuous learning.
                            </Typography>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    href="#work"
                                >
                                    View Portfolio
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    href="#contact"
                                >
                                    Get In Touch
                                </Button>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                flexWrap="wrap"
                            >
                                <Chip label="South African" />
                                <Chip label="Software Developer level 1" />
                                <Chip label="AWS + C# Focus" />
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Box
                            className="glass-card"
                            sx={{
                                p: 2,
                                borderRadius: 4,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                component="img"
                                src="/Photos/pfp.jpg"
                                alt="Diehan Drotschie"
                                sx={{
                                    width: "100%",
                                    maxWidth: 360,
                                    borderRadius: 4,
                                    boxShadow:
                                        "0 30px 60px rgba(15, 91, 91, 0.2)",
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
