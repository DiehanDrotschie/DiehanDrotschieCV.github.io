import { Box, Container, Divider, Stack, Typography } from "@mui/material";

export default function Experience() {
    return (
        <Box id="experience" className="section-tight">
            <Container>
                <Stack spacing={3}>
                    <Typography variant="h2">Experience</Typography>
                    <Box className="glass-card" sx={{ p: 3, borderRadius: 4 }}>
                        <Stack spacing={2}>
                            <Typography variant="h4">
                                Software Engineering Internship, Games Global
                            </Typography>
                            <Typography color="text.secondary">
                                June 2024 - July 2024
                            </Typography>
                            <Typography>
                                Contributed to interactive gameplay features and
                                collaborated with a talented team, gaining
                                hands-on experience in game development.
                            </Typography>
                            <Divider />
                            <Typography variant="h4">
                                Graduate Software Developer, Games Global
                            </Typography>
                            <Typography color="text.secondary">
                                January 2025 - May 2025
                            </Typography>
                            <Typography>
                                Focused on service development while upskilling
                                in AWS and C#. Continued to contribute to
                                interactive gameplay features across team
                                projects.
                            </Typography>
                            <Divider />
                            <Typography variant="h4">
                                Software Developer Level 1, Games Global
                            </Typography>
                            <Typography color="text.secondary">
                                May 2025 - Present
                            </Typography>
                            <Typography>
                                Took on expanded responsibility across multiple games simultaneously, handling service-related bug fixes and contributing to game architecture improvements. Onboarded and mentored a new developer through building their first game service. Built internal automation tools to streamline processes, while continuing to deepen expertise in C#, .NET, and scalable backend development.
                            </Typography>
                            <Typography>
                                In 2026, assumed sole ownership of all service development — responsible for creating, managing, and improving game services end-to-end. Expanded into client-side development, implementing features across games. Developed an AI-powered translation tool leveraging AWS to automate and significantly reduce the cost of the team's localisation workflow.
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
