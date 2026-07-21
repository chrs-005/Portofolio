/* ============================================================
   EDIT ME — every piece of text on the site lives here.
   Change any value, save, refresh. No other file needs touching.
   Fields marked (HTML ok) accept tags like <em>…</em> for the
   italic serif accent.
   ============================================================ */

window.CONTENT = {

  meta: {
    title: "Christophe El Chabab — AI · CS & Math",
  },

  nav: {
    monogram: "CE",
    links: [
      { label: "About",      href: "#about" },
      { label: "Projects",   href: "#projects" },
      { label: "Experience", href: "#experience" },
      { label: "Contact",    href: "#contact" },
    ],
    resume: { label: "Résumé", href: "#" },     // drop your PDF in the folder and link it here
  },

  hero: {
    eyebrow: "AI · Data Science — Beirut ⇄ Boston",

    // Each entry is one line of the big kinetic name
    nameLines: ["Christophe", "El Chabab"],

    // The giant translucent word floating behind the name
    ghostWord: "CHABAB",

    // (HTML ok)
    tagline:
      "Dual-degree CS & Mathematics student at AUB — GPA 4.00 — concentrating in AI. I build everything from <em>physics-informed neural networks</em> to <em>image-to-LaTeX</em> pipelines.",

    ctas: [
      { label: "See my work",  href: "#projects", primary: true },
      { label: "Get in touch", href: "mailto:christophe.chabab@gmail.com", primary: false },
    ],

    socials: [
      { type: "github",   label: "GitHub",   href: "https://github.com/chrs-005" },
      { type: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/christophe-chabab-74915b288/" },
      { type: "mail",     label: "Email",    href: "mailto:christophe.chabab@gmail.com" },
    ],

    scrollHint: "scroll",
  },

  // Looping ticker between the hero and About. Every other item is
  // rendered in the italic serif for rhythm.
  marquee: [
    "Python", "PyTorch", "C / C++", "Java", "React", "SQL",
    "MATLAB", "Scikit-learn", "Keras", "Hugging Face", "Pandas",
    "Motion Graphics", "Blender", "After Effects",
  ],

  about: {
    label: "01 — About",
    heading: "Math for <em>rigor,</em> AI for <em>reach.</em>",   // (HTML ok)
    lead:
      "I'm a Top-10 MERIT scholar at the American University of Beirut pursuing a dual degree in Computer Science & Engineering and Mathematics, with an exchange semester at Boston University. I've researched AI-driven solutions to physics-based inverse problems, taught algorithms to engineering cohorts, and led ACM's largest student events in Lebanon.",
    stats: [
      { value: "4.00",  label: "GPA — dual degree, AUB" },
      { value: "10⁻⁶",  label: "PINN parameter-recovery error" },
      { value: "30+",   label: "students mentored as TA" },
      { value: "13",    label: "nationwide ACM events led" },
    ],
  },

  projects: {
    label: "02 — Selected Projects",
    heading: "Things I've <em>built.</em>",                        // (HTML ok)
    items: [
      {
        title: "Image → LaTeX",
        desc: "CNN encoder + attention LSTM decoder that turns rendered formula images into LaTeX code.",
        tags: ["Python", "PyTorch", "CNN · LSTM"],
        year: "2026",
        href: "#",          // link to repo / case study when ready
      },
      {
        title: "PINN Inverse Problems",
        desc: "Physics-informed neural networks recovering hidden parameters of ODEs & nonlinear PDEs — down to 10⁻⁶ error.",
        tags: ["Research", "PINNs", "Optimization"],
        year: "2024–25",
        href: "#",
      },
      {
        title: "Pokémon RL Agent",
        desc: "Temporal-difference Q-learning agent that learns to win battles in a Pokémon simulator.",
        tags: ["Java", "Reinforcement Learning"],
        year: "2025",
        href: "#",
      },
      {
        title: "Your Next Project",
        desc: "This slot is waiting — add it in js/content.js.",
        tags: ["Coming soon"],
        year: "—",
        href: "#",
      },
    ],
  },

  experience: {
    label: "03 — Experience",
    heading: "Where I've <em>worked.</em>",                        // (HTML ok)
    jobs: [
      {
        dates: "Jun 2024 — Mar 2025",
        role: "Research Assistant",
        org: "AUB Department of Mathematics",
        note: "AI-driven solutions for physics-based inverse problems — classical optimizers and PINN models for logistic models and nonlinear PDEs.",
      },
      {
        dates: "Jan 2024 — Present",
        role: "Teaching Assistant",
        org: "AUB Faculty of Engineering",
        note: "Weekly labs and mentoring for 30+ students in Intro to Programming and Design & Analysis of Algorithms.",
      },
      {
        dates: "Jan 2023 — Present",
        role: "Instructor",
        org: "Elevate Arabia & Private Tutoring",
        note: "Customized SAT, math, physics and programming lectures that boosted student performance by 40%+.",
      },
      {
        dates: "Aug 2023 — Sep 2023",
        role: "Cyber Intelligence Intern",
        org: "POTECH Consulting",
        note: "Passive reconnaissance across 15+ OSINT sources — domains, DNS records, leaked credentials, server metadata.",
      },
    ],
    educationLabel: "Education",
    education: [
      {
        dates: "2023 — Present",
        school: "American University of Beirut",
        detail: "Dual degree: B.E. Computer Science & Engineering + B.S. Mathematics. Top-10 MERIT full scholarship, GPA 4.00.",
      },
      {
        dates: "Aug — Dec 2025",
        school: "Boston University",
        detail: "Exchange semester, representing my home university and country.",
      },
      {
        dates: "2008 — 2023",
        school: "Collège de la Sainte Famille",
        detail: "French Baccalaureate in General Sciences — Valedictorian, 19.94 / 20.",
      },
    ],
  },

  contact: {
    label: "04 — Contact",
    headingLines: ["Let's build", "<em>something.</em>"],          // (HTML ok)
    sub: "Open to internships, research collaborations, and interesting problems.",
    email: "christophe.chabab@gmail.com",
    footerLeft: "© 2026 Christophe El Chabab",
    footerRight: "Beirut ⇄ Boston — designed & built by me",
  },
};
