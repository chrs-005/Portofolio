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
    eyebrow: "AI · Software · Data Science",

    // Each entry is one line of the big kinetic name
    nameLines: ["Christophe", "El Chabab"],

    // The giant translucent word floating behind the name
    ghostWord: "CHABAB",

    // (HTML ok)
    tagline:
      "Dual-degree CS & Mathematics student at AUB — GPA 4.00. I build AI end-to-end, from <em>retrieval pipelines</em> to <em>image-to-LaTeX</em> models.",

    ctas: [
      { label: "See my work",  href: "#projects", primary: true },
      { label: "Get in touch", href: "mailto:christophe.chabab@gmail.com", primary: false },
    ],

    socials: [
      { type: "github",   label: "GitHub",   href: "https://github.com/chrs-005" },
      { type: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/christopheelchabab/" },
      { type: "mail",     label: "Email",    href: "mailto:christophe.chabab@gmail.com" },
    ],

    scrollHint: "scroll",
  },

  // Looping ticker between the hero and About. Every other item is
  // rendered in the italic serif for rhythm.
  marquee: [
    "Python", "C++", "Java", "TypeScript", "JavaScript", "SQL",
    "PyTorch", "Hugging Face", "FastAPI", "NestJS", "React",
    "PostgreSQL", "Qdrant", "Docker", "NumPy", "Git",
  ],

  about: {
    label: "01 — About",
    heading: "Math for <em>rigor,</em> AI for <em>reach.</em>",   // (HTML ok)
    lead:
      "I'm a Top-10 MERIT scholar at the American University of Beirut on a dual degree in Computer Science & Engineering and Mathematics, with an exchange semester at Boston University. Lately I've been shipping production AI — backend and data pipelines at Eurisko, a multilingual WhatsApp ordering agent at TheFactory.Ai — alongside research on physics-informed neural networks and teaching 500+ engineering students.",
    stats: [
      { value: "4.00",  label: "GPA — dual degree, AUB" },
      { value: "500+",  label: "students taught as TA" },
      { value: "92%",   label: "semantic retrieval top-3 accuracy" },
      { value: "86%",   label: "RL agent win rate" },
    ],
  },

  projects: {
    label: "02 — Selected Projects",
    heading: "Things I've <em>built.</em>",                        // (HTML ok)
    items: [
      {
        title: "Image → LaTeX",
        desc: "Fine-tuned a ViT–Transformer for image-to-LaTeX generation — 71% exact-match and 0.89 BLEU, beating a CNN–LSTM baseline (58%). Trained on 100K pairs; FastAPI/React demo on Hugging Face Spaces at 180 ms latency.",
        tags: ["Python", "PyTorch", "ViT", "Transformers"],
        year: "2026",
        href: "#",          // link to repo / case study when ready
      },
      {
        title: "Pokémon RL Agent",
        desc: "Temporal-difference Q-learning agent with custom state, action and reward design — 86% win rate over 1,500+ simulated battles and first place in the class tournament.",
        tags: ["Java", "Q-Learning", "RL"],
        year: "2025",
        href: "#",
      },
      {
        title: "Auto-Grading Judge",
        desc: "Co-built the course's first auto-grading judge — NumPy-generated test inputs and AST parsing to flag forbidden methods, cutting grading time 50% and speeding feedback for 500+ students.",
        tags: ["Python", "NumPy", "AST"],
        year: "2024–26",
        href: "#",
      },
    ],
  },

  experience: {
    label: "03 — Experience",
    heading: "Where I've <em>worked.</em>",                        // (HTML ok)
    jobs: [
      {
        dates: "Jul 2026 — Present",
        role: "Software Engineering Intern",
        org: "Eurisko",
        note: "Backend services and data pipelines in TypeScript, NestJS, PostgreSQL and Qdrant for an AI investment platform — conversational assistance, portfolio analytics, and 15+ technical indicators. Reached 100% unit-test coverage across 4+ services and built a structured logging system for faster failure tracing.",
      },
      {
        dates: "May 2026 — Jun 2026",
        role: "AI Engineering Intern",
        org: "TheFactory.Ai",
        note: "Built and deployed a WhatsApp ordering agent (Python, FastAPI, Whisper Large V3, WhatsApp Cloud API) turning multilingual voice orders into ERP-ready JSON. A Sentence-Transformers + Qdrant pipeline matched 1,500+ products at 92% top-3 accuracy, cutting manual processing 65%.",
      },
      {
        dates: "Jan 2024 — May 2026",
        role: "Teaching Assistant",
        org: "AUB Faculty of Engineering",
        note: "Taught and graded 130+ students in Intro to Programming and 150+ in Design & Analysis of Algorithms, and helped ship the course's first auto-grading judge — 50% less grading time for 500+ students.",
      },
      {
        dates: "Jun 2024 — Mar 2025",
        role: "Research Assistant",
        org: "AUB Department of Mathematics",
        note: "Researched AI for physics-based inverse problems in a five-person team — classical optimizers and PINNs recovering parameters of ODEs and nonlinear PDEs down to 10⁻⁶ error.",
      },
    ],
    educationLabel: "Education",
    education: [
      {
        dates: "2023 — Present",
        school: "American University of Beirut",
        detail: "Dual degree: B.E. Computer Science & Engineering + B.S. Mathematics. Top-10 MERIT full scholarship, GPA 4.00. Concentration in AI & Data Science / Theoretical CS.",
      },
      {
        dates: "Aug — Dec 2025",
        school: "Boston University",
        detail: "Exchange student focused on NLP, reinforcement learning, data science and databases.",
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
