import { Box } from "@mui/material";
import { academics, navItems, projects, skills } from "./data.js";
import About from "./sections/About.jsx";
import Achievements from "./sections/Achievements.jsx";
import Contact from "./sections/Contact.jsx";
import Experience from "./sections/Experience.jsx";
import Footer from "./sections/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import NavBar from "./sections/NavBar.jsx";
import Skills from "./sections/Skills.jsx";
import Work from "./sections/Work.jsx";

export default function App() {
  return (
    <Box sx={{ flex: 1 }}>
      <NavBar navItems={navItems} />
      <Hero />
      <About />
      <Skills skills={skills} />
      <Work projects={projects} />
      <Experience />
      <Achievements academics={academics} />
      <Contact />
      <Footer />
    </Box>
  );
}
