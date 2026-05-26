import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";

function ImageGalleryDialog({ project, open, onClose }) {
    const [index, setIndex] = useState(0);
    const images = project?.images ?? [];

    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setIndex((i) => (i + 1) % images.length);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
        if (e.key === "Escape") onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            onKeyDown={handleKeyDown}
            TransitionProps={{ onEntering: () => setIndex(0) }}
        >
            <DialogContent
                sx={{ p: 0, position: "relative", bgcolor: "black" }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "white",
                        zIndex: 1,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <IconButton
                        onClick={prev}
                        disabled={images.length <= 1}
                        sx={{
                            position: "absolute",
                            left: 8,
                            color: "white",
                            zIndex: 1,
                        }}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <Box
                        component="img"
                        src={images[index]}
                        alt={`${project?.title} image ${index + 1}`}
                        sx={{
                            width: "100%",
                            maxHeight: "70vh",
                            objectFit: "contain",
                        }}
                    />

                    <IconButton
                        onClick={next}
                        disabled={images.length <= 1}
                        sx={{
                            position: "absolute",
                            right: 8,
                            color: "white",
                            zIndex: 1,
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>

                <Stack
                    direction="row"
                    justifyContent="center"
                    spacing={1}
                    sx={{ p: 1.5, bgcolor: "black" }}
                >
                    {images.map((img, i) => (
                        <Box
                            key={img}
                            component="img"
                            src={img}
                            alt={`thumbnail ${i + 1}`}
                            onClick={() => setIndex(i)}
                            sx={{
                                width: 56,
                                height: 56,
                                objectFit: "cover",
                                borderRadius: 1,
                                cursor: "pointer",
                                opacity: i === index ? 1 : 0.4,
                                border:
                                    i === index
                                        ? "2px solid white"
                                        : "2px solid transparent",
                                transition: "opacity 0.2s, border-color 0.2s",
                            }}
                        />
                    ))}
                </Stack>

                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        textAlign: "center",
                        color: "grey.400",
                        pb: 1,
                    }}
                >
                    {index + 1} / {images.length}
                </Typography>
            </DialogContent>
        </Dialog>
    );
}

export default function Work({ projects }) {
    const [selected, setSelected] = useState(null);

    return (
        <Box id="work" className="section">
            <Container>
                <Stack spacing={4}>
                    <Typography variant="h2">Portfolio</Typography>
                    <Typography>
                        These are some very basic projects I have worked on.
                    </Typography>
                    <Grid container spacing={3}>
                        {projects.map((project) => (
                            <Grid item xs={12} md={6} key={project.title}>
                                <Card
                                    className="glass-card"
                                    onClick={() => setSelected(project)}
                                    sx={{
                                        height: "100%",
                                        cursor: "pointer",
                                        "&:hover": { opacity: 0.9 },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="220"
                                        image={project.images[0]}
                                        alt={project.title}
                                    />
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Typography variant="h4">
                                                {project.title}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                {project.description}
                                            </Typography>
                                            {project.images.length > 1 && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {project.images.length}{" "}
                                                    images — click to view
                                                    gallery
                                                </Typography>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </Container>

            <ImageGalleryDialog
                project={selected}
                open={Boolean(selected)}
                onClose={() => setSelected(null)}
            />
        </Box>
    );
}
