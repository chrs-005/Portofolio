/* ============================================================
   EDIT ME. Every piece of text and media on the site lives here.
   Change a value, save, refresh. No other file needs touching.

   Media items are either
     { type: "image",  src: "assets/...", alt: "...", caption: "..." }
     { type: "visual", name: "latex" | "rl" | "pinn" | "ble" | "retina" | "market" | "voice" | "grader" | "fourier", caption: "..." }
   "visual" is a live graphic drawn in the browser (js/visuals.js).
   To use a real screenshot instead, swap it for an "image" item.

   Links whose href is "#" are hidden, so you can leave them
   in place until the real URL exists. Same for an empty "role".
   ============================================================ */

window.CONTENT = {

  meta: { title: "Christophe El Chabab" },

  nameLines: ["Christophe", "El Chabab"],
  ghostWord: "CHABAB",

  intro:
    "Computer Science & Engineering and Mathematics student at the American University of Beirut. GPA 4.00 on a top-10 MERIT scholarship. I build machine learning systems and the backends around them: retrieval pipelines, agents, and a model that reads math from images. Currently a software engineering intern at Eurisko.",

  links: [
    { label: "GitHub",   href: "https://github.com/chrs-005" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/christopheelchabab/" },
    { label: "Email",    href: "mailto:christophe.chabab@gmail.com" },
    { label: "CV",       href: "#" },            // put your PDF in the folder and link it here
  ],

  location: {
    place: "Beirut, Lebanon",
    coords: "33.89° N  35.50° E",
    timeZone: "Asia/Beirut",
  },

  nav: [
    { label: "Research",   href: "#research" },
    { label: "Projects",   href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "About",      href: "#about" },
    { label: "Contact",    href: "#contact" },
  ],

  /* ---------------------------------------------------------- */
  research: {
    title: "Research",
    items: [
      {
        context: "AI Research Fellow, AUB Frontiers AI Fellows",
        dates: "11/2026 to now",
        status: "In progress",
        title: "Keeping retinal vessels connected when segmenting them",
        body: [
          "Vessel segmentation models are usually trained and judged on Dice, which counts pixels. A model can score well and still cut a vessel in two or join the wrong branches at a bifurcation, and those structural errors are what matter when the vessel tree is the thing being studied.",
          "I reproduced U-Net baselines on the DRIVE dataset and built a pipeline that turns a predicted skeleton into a graph of endpoints, bifurcations and connections, then measured where the structure breaks using clDice and Betti-number errors.",
          "Now I am building a graph-based refinement step that passes information along the branches to recover missing connections, and comparing different ways of building the graph and topology-aware training objectives.",
        ],
        figures: [],
        stack: "U-Net, DRIVE, graph representation learning, clDice, Betti numbers",
        role: "",
        links: [],
        media: [
          {
            type: "visual",
            name: "retina",
            caption: "Illustration. A vessel tree read as a graph of endpoints and bifurcations. One branch is broken, and the refinement step reconnects it.",
          },
        ],
      },
      {
        context: "Final year project, AUB · Prof. Louay Bazzi",
        dates: "09/2026 to now",
        status: "In progress",
        title: "Checking attendance without cameras or ID",
        body: [
          "Phones and cards can be handed to a friend, and face recognition raises privacy problems. In a team of three, we are building a way for students who are present to confirm each other, using Bluetooth to find who sits nearby.",
          "In a class test with 34 phones, a method that learns each phone's signal strength found the true closest neighbour for 83% of phones, against 74% when taking the 3 strongest signals. That method was chosen from 10 on this one session, so a second session comes next to check that it holds.",
        ],
        figures: [
          { value: "83%", label: "true closest neighbour found" },
          { value: "74%", label: "with the 3 strongest signals" },
          { value: "34",  label: "phones in the class test" },
          { value: "10",  label: "methods compared" },
        ],
        stack: "Bluetooth Low Energy, phones",
        role: "",   // your part, e.g. "I built ..." (hidden while empty)
        links: [],
        media: [
          {
            type: "image",
            src: "assets/projects/fyp-accuracy-map.jpg",
            alt: "Classroom seat map where each seat shows how far the rebuilt position was from the true seat, and whether the real closest neighbour was found",
            caption: "Seat by seat, the best of the 10 methods: metres between the true seat and the rebuilt position (typically 1.0 m), and a tick where the real closest neighbour was among its 3 picks. Chosen on this one session.",
          },
          {
            type: "visual",
            name: "ble",
            caption: "Illustration of the idea. Each phone listens for the others and links to the ones it thinks sit closest.",
          },
        ],
      },
      {
        context: "Research assistant, AUB Department of Mathematics",
        dates: "06/2024 to 03/2025",
        status: "",
        title: "Recovering hidden parameters with physics-informed networks",
        body: [
          "Given noisy measurements of a system, find the parameters of the equation that produced them. In a team of five, I worked on logistic growth models and nonlinear PDEs, and built both classical optimizers and physics-informed neural networks (PINNs) to compare them.",
          "On ODEs the recovered parameters were off by as little as 10⁻⁶. PDEs are harder: the best runs were off by about 10⁻².",
        ],
        figures: [
          { value: "10⁻⁶", label: "parameter error on ODEs" },
          { value: "10⁻²", label: "parameter error on PDEs" },
          { value: "5",    label: "people on the team" },
        ],
        stack: "PINNs, classical optimizers",
        role: "",
        links: [],
        media: [
          {
            type: "visual",
            name: "pinn",
            caption: "Illustration. A logistic curve fitted to noisy samples while its parameters converge, with the loss falling on the right.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- */
  projects: {
    title: "Projects",
    items: [
      {
        context: "Agentic Systems course, AUB · With the Office of Student Affairs",
        dates: "10/2026 to now",
        status: "In progress",
        title: "ClubOps, an assistant for club handovers",
        body: [
          "AUB club cabinets change every year, and what the old leaders knew gets lost in old chats. In a team of three, we are building an agent that learns a club's know-how from old chats, emails and handover notes.",
          "It fills in the Office of Student Affairs event proposal form, which has up to 52 questions, and plans the deadlines backwards from the event date. Nothing is saved or sent until a person approves it.",
        ],
        figures: [
          { value: "52",    label: "questions on the form it fills" },
          { value: "8",     label: "steps at most per plan" },
          { value: "$0.05", label: "cost cap per plan" },
        ],
        stack: "Python, Pydantic, LLM agents",
        role: "",
        links: [],
        media: [
          {
            type: "image",
            src: "assets/projects/clubops-cover.jpg",
            alt: "ClubOps sign-in page: Great events. A lasting legacy. Keep your plans, your people, and everything you've learned together.",
            caption: "ClubOps, deployed for AUB club cabinets.",
          },
          {
            type: "image",
            src: "assets/projects/clubops-question.jpg",
            alt: "ClubOps screen: while building an event plan, the agent asks which room to use before it continues",
            caption: "The agent stops and asks when a fact is missing, here the room. It is limited to 8 steps and $0.05 per plan. Demo with synthetic club data.",
          },
          {
            type: "image",
            src: "assets/projects/clubops-review-warning.jpg",
            alt: "ClubOps review screen warning that a document contains hidden instructions and must be reviewed individually",
            caption: "Every new fact waits in Review for a cabinet member. A document with hidden instructions is flagged and kept out of bulk approval. Demo with synthetic data.",
          },
        ],
      },
      {
        context: "Personal project",
        dates: "03/2026 to 04/2026",
        status: "",
        title: "Image to LaTeX",
        body: [
          "Give it a picture of a formula and it writes the LaTeX that produces it. I first built a CNN encoder with an LSTM decoder, then fine-tuned a Vision Transformer encoder with a Transformer decoder on 100K image and formula pairs.",
          "The transformer gets 71% of formulas exactly right (0.89 BLEU), against 58% for the CNN and LSTM. The demo runs on Hugging Face Spaces with a FastAPI backend and a React front end, at 180 ms per image on average.",
        ],
        figures: [
          { value: "71%",    label: "exact match" },
          { value: "58%",    label: "CNN and LSTM baseline" },
          { value: "0.89",   label: "BLEU" },
          { value: "180 ms", label: "average per image" },
        ],
        stack: "Python, PyTorch, ViT, Transformers, FastAPI, React",
        role: "",
        links: [
          { label: "Live demo", href: "#" },   // your Hugging Face Space URL
          { label: "Code",      href: "#" },
        ],
        media: [
          {
            type: "visual",
            name: "latex",
            caption: "Illustration of the task. The image is cut into patches for the ViT, and the decoder writes LaTeX one token at a time.",
          },
        ],
      },
      {
        context: "Course final project",
        dates: "11/2025",
        status: "",
        title: "A Pokémon battle agent that learns by playing",
        body: [
          "I designed the state, actions and rewards for a temporal-difference Q-learning agent and trained it in the course's battle simulator.",
          "It won 86% of 1,500+ simulated battles and took first place in the class tournament.",
        ],
        figures: [
          { value: "86%",    label: "win rate" },
          { value: "1,500+", label: "simulated battles" },
          { value: "1st",    label: "in the class tournament" },
        ],
        stack: "Java, Q-learning",
        role: "",
        links: [{ label: "Code", href: "#" }],
        media: [
          {
            type: "visual",
            name: "rl",
            caption: "Illustration. Values spread back from good outcomes as the agent plays, and the greedy path follows them.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- */
  experience: {
    title: "Experience",
    items: [
      {
        org: "Eurisko",
        role: "Software Engineering Intern",
        dates: "07/2026 to now",
        text: "Backend services and data pipelines for an AI investment platform: a chat assistant, portfolio analytics, financial news search and 15+ technical indicators. I brought 4+ services to 100% unit test coverage and built a structured logging system, so API, pipeline and third-party failures can be traced quickly.",
        stack: "TypeScript, NestJS, PostgreSQL, Qdrant",
        visual: "market",
      },
      {
        org: "TheFactory.Ai",
        role: "AI Engineering Intern",
        dates: "05/2026 to 06/2026",
        text: "A WhatsApp ordering agent. Customers send voice notes in any language and get back an order the ERP can read as JSON. Product matching uses Sentence Transformers embeddings in Qdrant over 1,500+ products, with the right product in the top 3 for 92% of requests. Manual processing time dropped by 65%.",
        stack: "Python, FastAPI, Whisper Large V3, WhatsApp Cloud API, Qdrant",
        visual: "voice",
      },
      {
        org: "AUB Faculty of Engineering",
        role: "Teaching Assistant",
        dates: "01/2024 to 05/2026",
        text: "Taught and graded 130+ students in Introduction to Programming and 150+ in Design and Analysis of Algorithms, and mentored 40+ of them through weekly office hours and workshops on complexity, data structures and problem solving. I also co-built the course's first auto-grading judge, which runs every submission against 20,000+ generated test inputs. Grading time per problem fell by half for 500+ students.",
        stack: "Python, NumPy",
        visual: "grader",
      },
      {
        org: "Elevate Arabia",
        role: "Lecturer and Academic Mentor",
        dates: "01/2024 to 05/2026",
        text: "Designed and taught advanced mathematics, physics and programming courses for 120+ students, built around reasoning through problems rather than memorising them. I also ran SAT preparation, where students improved by 180 points on average, and mentored students on their own STEM projects.",
        stack: "Mathematics, physics, programming, SAT",
        visual: "fourier",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  about: {
    title: "About",
    text: [
      "I study at AUB on a dual degree, a B.E. in Computer Science & Engineering and a B.S. in Mathematics, with concentrations in AI and data science and in theoretical computer science. I spent fall 2025 at Boston University on exchange, taking NLP, reinforcement learning, data science and databases.",
      "Outside of class I have been a scout since 2013 and now lead as a scout chief, and I spent two years on the ACM student branch cabinet.",
    ],
    lists: [
      {
        heading: "Education",
        rows: [
          { left: "2023 to now",  right: "American University of Beirut. B.E. Computer Science & Engineering and B.S. Mathematics. GPA 4.00, top-10 MERIT full scholarship." },
          { left: "Fall 2025",    right: "Boston University. Exchange semester." },
        ],
      },
      {
        heading: "Leadership",
        rows: [
          { left: "2013 to now",  right: "Scout chief, Les Scouts du Liban. 50+ members in weekly activities, 40+ nights of camps, and food drives for families affected by the conflict." },
          { left: "2023 to 2025", right: "Cabinet member, ACM AUB student branch. 13 nationwide events for 500+ students: AI bootcamps, programming contests and industry talks." },
        ],
      },
      {
        heading: "Tools",
        rows: [
          { left: "Languages",  right: "Python, C++, Java, TypeScript, JavaScript, SQL, MATLAB" },
          { left: "ML",         right: "PyTorch, scikit-learn, Keras, Hugging Face Transformers, NumPy, Pandas" },
          { left: "Backend",    right: "FastAPI, Flask, NestJS, React, PostgreSQL, Qdrant, REST, OpenAI API" },
          { left: "Everyday",   right: "Git, Docker, Linux, Jupyter, VS Code, PyCharm, IntelliJ" },
        ],
      },
    ],
  },

  contact: {
    label: "Write to me",
    email: "christophe.chabab@gmail.com",
    note: "Open to internships and research collaborations.",
    footer: "Christophe El Chabab, 2026",
  },
};
