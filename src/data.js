export const navItems = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "Achievements", href: "#achievements" },
    { label: "Contact", href: "#contact" },
];

export const skills = [
    "Java",
    "C",
    "Python",
    "HTML",
    "CSS",
    "R",
    "Dart + Firebase",
    "Delphi",
    "JavaScript/TypeScript + PIXI.js",
    "C#",
    "Aws",
    "Svelte",
];

export const projects = [
    {
        title: "Tic Tac Toe",
        description:
            "A Java-based game that detects wins, draws, and supports quick rematches.",
        images: ["/Photos/tictactoe.jpg"],
    },
    {
        title: "Impasse Game",
        description:
            "Grid-based puzzle with multi-color constraints and rule-driven solving.",
        images: ["/Photos/imp1.jpg", "/Photos/imp2.jpg"],
    },
    {
        title: "Moving Maze",
        description:
            "A shifting maze game with player tokens, board pushes, and goal-oriented play.",
        images: ["/Photos/mvz.jpg"],
    },
    {
        title: "Compression + Decompression Software",
        description:
            "Finite automata-based compression for images and text, with reversible decoding.",
        images: ["/Photos/decsoft.jpg"],
    },
    {
        title: "Wedding Table Allocation",
        description:
            "Guest lookup experience with table and date pairing from JSON records.",
        images: ["/Photos/wedding1.jpg", "/Photos/wedding2.jpg"],
    },
    {
        title: "Instagram Clone",
        description:
            "Dart + Firebase project exploring uploads, feeds, search, and social interactions.",
        images: [
            "/Photos/ios1.jpg",
            "/Photos/ios2.jpg",
            "/Photos/ios3.jpg",
            "/Photos/ios4.jpg",
            "/Photos/ios5.jpg",
        ],
    },
];

export const academics = {
    intro: "Stellenbosch University 2022: BSc Computer Science focal area - Data Science.",
    years: [
        {
            title: "1st Year marks",
            rows: [
                ["Computer Science 114", "91", "Pass with distinction"],
                ["Mathematics 114", "83", "Pass with distinction"],
                [
                    "Probability Theory and Statistics 114",
                    "77",
                    "Pass with distinction",
                ],
                ["Science in Context 178", "77", "Pass with distinction"],
                ["Data Science 141", "81", "Pass with distinction"],
                ["Computer Science 144", "94", "Pass with distinction"],
                ["Applied Mathematics 144", "88", "Pass with distinction"],
                ["Mathematics 144", "84", "Pass with distinction"],
            ],
        },
        {
            title: "2nd Year marks",
            rows: [
                ["Computer Science 214", "80", "Pass with distinction"],
                ["Applied Mathematics 214", "85", "Pass with distinction"],
                ["Mathematics 214", "84", "Pass with distinction"],
                ["Mathematical Statistics 214", "80", "Pass with distinction"],
                ["Computer Science 244", "76", "Pass with distinction"],
                ["Mathematics 244", "82", "Pass with distinction"],
                ["Mathematical Statistics 245", "60", "Pass"],
                ["Mathematical Statistics 246", "85", "Pass with distinction"],
                ["Data Science 241", "76", "Pass with distinction"],
            ],
        },
        {
            title: "3rd Year marks",
            rows: [
                ["Computer Science 315", "83", "Pass with distinction"],
                ["Computer Science 314", "91", "Pass with distinction"],
                ["Mathematical Statistics 312", "73", "Pass"],
                ["Data Science 316", "82", "Pass with distinction"],
                ["Computer Science 343", "92", "Pass with distinction"],
                ["Computer Science 344", "86", "Pass with distinction"],
                ["Computer Science 345", "90", "Pass with distinction"],
                ["Data Science 346", "84", "Pass with distinction"],
            ],
        },
    ],
};
