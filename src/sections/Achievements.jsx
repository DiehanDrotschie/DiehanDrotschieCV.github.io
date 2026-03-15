import {
  Box,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function Achievements({ academics }) {
  return (
    <Box id="achievements" className="section">
      <Container>
        <Stack spacing={4}>
          <Typography variant="h2">Achievements</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className="glass-card" sx={{ p: 3, borderRadius: 4 }}>
                <Stack spacing={2}>
                  <Typography variant="h4">Academic</Typography>
                  <Typography color="text.secondary">
                    Robertson High School (2017-2021) | Grade 12 (Senior Certificate)
                    - 94%
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      "Robertson High School Dux Learners Award",
                      "Top 10 Achievers Award - Western Cape",
                      "Student Council Member: Deputy Head Boy",
                      "Honorary academic awards - 5 years",
                      "1st Position in Grade - Gr 8-12",
                      "SA Mathematics Olympiad",
                      "Member of Golden Key International Society",
                      "Grade 12 Average: 94.57%",
                    ].map((item) => (
                      <Typography key={item}>- {item}</Typography>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box className="glass-card" sx={{ p: 3, borderRadius: 4 }}>
                  <Typography variant="h4" gutterBottom>
                    Culture
                  </Typography>
                  <Typography>- CSV Team Leader</Typography>
                </Box>
                <Box className="glass-card" sx={{ p: 3, borderRadius: 4 }}>
                  <Typography variant="h4" gutterBottom>
                    Sports
                  </Typography>
                  <Stack spacing={1}>
                    <Typography>
                      - Hockey: 0/19 A First Team, Hockey Umpire, Qualified for Tour team
                      to New Zealand
                    </Typography>
                    <Typography>- Athletics: Captain of Team</Typography>
                    <Typography>- Swimming: School First Team, Captain of Team</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Box className="glass-card" sx={{ p: 3, borderRadius: 4 }}>
            <Stack spacing={2}>
              <Typography variant="h3">University Education</Typography>
              <Typography color="text.secondary">{academics.intro}</Typography>
              {academics.years.map((year) => (
                <Box key={year.title}>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {year.title}
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Mark</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {year.rows.map((row) => (
                        <TableRow key={row[0]}>
                          <TableCell>{row[0]}</TableCell>
                          <TableCell>{row[1]}</TableCell>
                          <TableCell>{row[2]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
