const page = document.body.dataset.page;
const navLink = document.querySelector(`[data-nav="${page}"]`);
if (navLink) navLink.classList.add("active");

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);
revealElements.forEach((el) => revealObserver.observe(el));

const canvas = document.getElementById("starfield");
const ctx = canvas?.getContext("2d");
let stars = [];

function resizeCanvas() {
  if (!canvas || !ctx) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const count = Math.min(140, Math.floor((canvas.width * canvas.height) / 17500));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 0.2 + 0.05,
    size: Math.random() * 1.05 + 0.22,
    alpha: Math.random() * 0.5 + 0.25,
  }));
}

function drawStars() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    star.y += star.speed;
    if (star.y > canvas.height + 4) {
      star.y = -4;
      star.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(193, 222, 255, ${star.alpha})`;
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(drawStars);

const tiltElements = document.querySelectorAll(".tilt");
tiltElements.forEach((card) => {
  const reset = () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
    card.style.removeProperty("--mx");
    card.style.removeProperty("--my");
  };

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const dx = (event.clientX - rect.left) / rect.width - 0.5;
    const dy = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${(-dy * 5).toFixed(2)}deg) rotateY(${(dx * 6).toFixed(2)}deg)`;
    card.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  });

  card.addEventListener("mouseleave", reset);
});

const quoteBtn = document.getElementById("quote-btn");
const launchBtn = document.getElementById("launch-btn");
const quoteOutput = document.getElementById("quote-output");
const signalCount = document.getElementById("signal-count");
const penguinAvatar = document.querySelector(".penguin-avatar");
const penguinBelly = document.querySelector(".penguin-belly");
const paletteOpenBtn = document.getElementById("palette-open");
let commandPalette = document.getElementById("command-palette");
let commandBackdrop = document.getElementById("command-backdrop");
let commandInput = document.getElementById("command-input");
let commandResults = document.getElementById("command-results");
const quizQuestion = document.getElementById("quiz-question");
const quizProgress = document.getElementById("quiz-progress");
const quizOptions = document.getElementById("quiz-options");
const quizStartBtn = document.getElementById("quiz-start");
const quizResetBtn = document.getElementById("quiz-reset");
const quizScore = document.getElementById("quiz-score");
const headerThemeSelect = document.getElementById("header-theme-select");
const themeCycleBtn = document.getElementById("theme-cycle-btn");
const heroName = document.getElementById("hero-name");
const heroStatus = document.getElementById("hero-status");
const heroTagline = document.getElementById("hero-tagline");
const pageFooterLine = document.getElementById("page-footer-line");
const miniTerminalForm = document.getElementById("mini-terminal-form");
const miniTerminalInput = document.getElementById("mini-terminal-input");
const miniTerminalOutput = document.getElementById("mini-terminal-output");
const miniTerminalScreen = document.querySelector(".mini-terminal-screen");
const miniTerminalTheme = document.getElementById("mini-terminal-theme");
const NEPAL_TIMEZONE = "Asia/Kathmandu";
const BS_CONVERTER_URL = "https://cdn.jsdelivr.net/npm/nepali-date-library@1.1.9/+esm";
const THEME_STORAGE_KEY = "neoThemeVariant.v1";
const ACTION_STORAGE_KEY = "neoAutoAction.v1";
const HERO_TYPED_KEY = "neoHeroTyped.v1";
const MINI_PROMPT = "╰─❯";
const NERD_FONT_FAMILIES = [
  "JetBrainsMono Nerd Font",
  "FiraCode Nerd Font",
  "CaskaydiaCove Nerd Font",
];
const THEME_OPTIONS = [
  "neo",
  "mint",
  "sunset",
  "midnight",
  "ember",
  "arctic",
  "grape",
  "toxic",
  "ocean",
  "bloodmoon",
  "liquidglass",
  "paper",
  "blackflag",
];
const MAX_TERMINAL_LINES = 220;
const TERMINAL_COMMANDS = [
  "help", "whoami", "mission", "status", "clear",
  "stack", "skills", "age", "location", "school", "goal", "motto",
  "books", "movies", "games", "anime", "crypto", "people", "youtube",
  "launch", "insight", "quote", "matrix", "music", "elon", "istj", "reset", "quiz",
  "theme", "home", "about", "contact", "github",
  "ls", "pwd", "uname", "nepal", "date", "time", "pulse", "echo",
];
let launches = 0;
let adToBsConverter = null;
let startPersonaQuiz = null;
let currentTheme = "neo";
let terminalHistory = [];
let terminalHistoryIndex = 0;
let terminalDraft = "";
let blackflagShotLockUntil = 0;
const typewriterTokens = new WeakMap();
const heroTaglineVariants = [
  "Aura Farmer // Chaotic Fun 🚀",
  "Neo Build Mode // Signal > Noise",
  "Debate + Code + Ship ⚡",
  "Open Source + AI + Linux 🐧",
  "Chaos Energy // Clean Execution",
  "From Gongabu to Global Ideas 🌍",
  "Future AI Engineer // In Progress",
  "Keyboard Warrior // Builder Mindset",
];
const aiConstellationTaglines = [
  "Aura Farmer",
  "Signal > Noise",
  "Debate Mode Always Ready",
  "Build Fast, Think Deep",
  "Linux Brain, Space Heart",
  "Chaos Energy, Clean Execution",
  "Ship Weird Ideas",
  "Open Source Mindset",
  "AI Tools, Real Impact",
  "Gongabu to Global",
  "Minimal UI, Max Aura",
  "Neo Stack Activated",
  "Focus: Learn, Build, Debate",
  "Future AI Engineer Loading",
  "Curiosity Over Comfort",
  "Mission: Make It Work",
];
const aboutFooterLines = [
  "Aura Farmer: thinking deep, building fast.",
  "Neo lore: chaotic fun, clean execution.",
  "Debate mode always ready, code mode always on.",
  "Space theme, hacker heart, aura farming daily.",
  "Signal over noise, curiosity over comfort.",
  "Gongabu mind, global ambitions.",
  "Arch + Hyprland energy, zero fluff.",
  "Less scrolling, more shipping.",
  "I build fast, debug faster, sleep last.",
  "Chaotic fun with a clean commit history.",
  "Neo ops online. Aura farming in progress.",
  "I argue with logic, not volume.",
  "Code is my canvas, Linux is my brush.",
  "I ship ideas before they feel ready.",
  "Coffee, keyboards, and stubborn curiosity.",
  "Future-proof mindset, present-day hustle.",
  "Minimalism in UI, maximalism in ideas.",
  "I like hard books and harder bugs.",
  "Each commit is a small rebellion.",
  "Curiosity is the only permanent fuel.",
  "Build small. Think big. Iterate always.",
  "Aura farming is a daily discipline.",
  "No fluff, just signal.",
  "Debate mode: always armed with facts.",
  "Quiet focus, loud results.",
  "Ship in public, refine in private.",
  "Chaos is fine when the fundamentals are clean.",
  "I turn problems into prototypes.",
  "Less talk, more terminal.",
  "Neo mindset: stay dangerous, stay curious.",
  "Ideas first, ego last.",
  "If it compiles, it ships.",
  "Hard problems are my cardio.",
  "I collect bugs like trophies.",
  "Design with intent, code with speed.",
  "I don’t chase trends, I build systems.",
  "Not perfect, just progressing.",
  "Signal the mission, cut the noise.",
  "I debate to learn, not to win.",
  "Keyboard warrior, logic defender.",
  "Clean diff, loud impact.",
  "Every error is an invitation.",
  "Debugging is my form of meditation.",
  "Weird ideas, real builds.",
  "No sleep, just prototypes.",
  "I’m not late, I’m iterating.",
  "Neo energy, Gongabu roots.",
  "Courage is just a commit away.",
  "Minimal UI, maximal aura.",
  "Rust? Python? I’m still shipping.",
  "Everything is solvable with enough clarity.",
  "A good argument is just a clean stack trace.",
  "I build the thing I wanted to exist.",
  "Aura farming is just consistent output.",
  "I read error messages after I panic.",
  "Fast feedback beats perfect plans.",
  "Learn fast, ship faster.",
  "Discipline beats motivation on slow days.",
];

const quotes = [
  "Aura farmer protocol: build daily.",
  "Debate mode: logic over noise.",
  "AI mindset: practical systems beat hype.",
  "Neo mode: stay curious, stay dangerous.",
  "Open source: ship in public, improve fast.",
  "Discipline is a multiplier.",
  "Bug found, ego down, skills up.",
  "My keyboard gets more workouts than I do.",
  "Coffee in, code out.",
  "If it compiles first try, I get suspicious.",
  "Linux teaches patience and power.",
  "The stack trace is a treasure map.",
  "I do not fear hard problems, I schedule them.",
  "Small commits, big progress.",
  "Git is my memory when my brain cache misses.",
  "Every error message is free tutoring.",
  "I refactor because future-me has standards.",
  "A good engineer is a professional note taker.",
  "If docs are optional, chaos is mandatory.",
  "Late night coding is just time travel with bugs.",
  "Do not panic. Read the logs.",
  "Everything is impossible until it is merged.",
  "I talk fast, type faster, debug longest.",
  "Coding is 10 percent typing and 90 percent thinking.",
  "The best optimization is deleting useless code.",
  "When in doubt, write tests.",
  "Future AI engineer loading.",
  "I break things to understand them deeply.",
  "Neat code is silent confidence.",
  "I like open source because receipts are public.",
  "Less scrolling, more shipping.",
  "Touch grass, then touch code.",
  "I do not chase trends, I build systems.",
  "One more commit and then I sleep. Maybe.",
  "My room is messy, my logic is not.",
  "I solve a Rubik's cube faster than bad architecture.",
  "Debate skill unlocked: argue with facts, not volume.",
  "Speak clearly, code clearly.",
  "No excuses in prod, only fixes.",
  "The matrix is real, it is called dependency hell.",
  "If you can explain it simply, you own it.",
  "Read books, write code, repeat.",
  "Philosophy for coders: know thy bug.",
  "Discipline beats motivation on slow days.",
  "I like difficult books and difficult problems.",
  "Linux terminal is where confidence lives.",
  "I ship weird ideas on purpose.",
  "Chaos is fine if your fundamentals are clean.",
  "Minimal UI, maximal aura.",
  "Never trust a silent build pipeline.",
  "A fast learner is a dangerous builder.",
  "No roadmap survives first user feedback.",
  "Programmer joke: I changed one line and fixed five bugs. I changed it back and fixed six.",
  "I do not copy code blindly. I audit it.",
  "If your code needs luck, it needs work.",
  "Readable code is social respect.",
  "Quality is not extra. It is the job.",
  "Ship in public, improve in public.",
  "Keyboard shortcuts are free power-ups.",
  "You do not need permission to learn deeply.",
  "I like ideas that scare lazy people.",
  "Every repo is a time capsule of decisions.",
  "Winners take notes, builders take action.",
  "I test edge cases because reality is rude.",
  "A bug report is a love letter from production.",
  "No one debates better than clean evidence.",
  "The simplest fix that works is elite.",
  "Logs do not lie, assumptions do.",
  "Version control is emotional control.",
  "If there is no challenge, there is no story.",
  "Calm mind, sharp output.",
  "I learn faster than yesterday's excuses.",
  "I do not chase perfection, I chase iteration.",
  "The command line never gaslights.",
  "Security is a feature, not a patch note.",
  "Tight loops build strong intuition.",
  "Complexity grows by default. Simplicity takes intent.",
  "Best flex: clean architecture at midnight.",
  "Sometimes the fix is deleting the feature.",
  "Great products are edited, not just built.",
  "The grind looks boring before it looks legendary.",
  "If you cannot measure it, you cannot improve it.",
  "No drama in commits, only clarity.",
  "AI is leverage for builders who think clearly.",
  "I optimize for signal, not noise.",
  "My tabs are many, my focus is one.",
  "I break procrastination with the first commit.",
  "Crypto taught me risk, code taught me control.",
  "Fewer excuses, more pull requests.",
  "Quiet room, loud ideas.",
  "Impossible is usually undocumented.",
  "The TODO list fears consistency.",
  "My English is fluent, my code should be too.",
  "I can debate anything, but I prefer shipping.",
  "Wired for learning, built for execution.",
  "Fun fact: production finds every shortcut.",
  "Build habits, not hype.",
  "Bug today, lesson forever.",
  "There are only 10 kinds of people: those who understand binary and those who do not.",
  "I debug because being psychic is not in the standard library.",
  "Works on my machine is not a deployment strategy.",
  "Programmer humor: semicolon missing, happiness missing.",
  "I would love to change the world, but they will not give me production access.",
  "Any code of your own that you have not looked at for 6 months is someone else's code.",
  "AI quote: automation rewards people who understand systems, not just tools.",
  "First make it work, then make it right, then make it fast.",
  "If at first you do not succeed, call it version 1.0.",
  "There is no place like 127.0.0.1.",
  "My code does not always run, but my confidence compiles.",
  "A clean commit is better than a perfect excuse.",
  "Real flex: readable code at 2 AM.",
  "Hard problems make strong engineers.",
];

const personaQuizQuestions = [
  { question: "Your coding peak time?", options: ["Early morning", "Afternoon", "Late night", "Random"], answer: 1 },
  { question: "When stuck, first move?", options: ["Read docs", "Use ChatGPT/AI", "Ask a friend", "Take a break"], answer: 1 },
  { question: "Preferred coding drink?", options: ["Water", "Tea", "Coffee", "Energy drink"], answer: 2 },
  { question: "Desk vibe?", options: ["Minimal clean", "Controlled chaos", "Fully messy", "Changes daily"], answer: 1 },
  { question: "Hardest school subject?", options: ["Math", "Science", "Nepali/English", "C++"], answer: 0 },
  { question: "Main motivation source?", options: ["Competition", "Curiosity", "Future goals", "Proving doubters wrong"], answer: 2 },
  { question: "You read error messages fully before fixing.", options: ["True", "False"], answer: 1 },
  { question: "Best non-Python language for you?", options: ["C/C++", "JavaScript", "Java", "None"], answer: 0 },
  { question: "Weekend coding hours?", options: ["0-2", "3-5", "6-8", "9+"], answer: 2 },
  { question: "If code works first try, you?", options: ["Celebrate", "Distrust it", "Commit instantly", "Re-run tests"], answer: 3 },
  { question: "Book type you enjoy most?", options: ["Self-help", "Philosophy", "Fiction/sci-fi", "Biography"], answer: 0 },
  { question: "Best study mode?", options: ["Silence", "Lo-fi/music", "Cafe noise", "With friends"], answer: 1 },
  { question: "In group chats you are:", options: ["Silent reader", "Meme sender", "Problem solver", "Debate starter"], answer: 3 },
  { question: "If someone challenges your idea:", options: ["Defend hard", "Ask questions", "Test both", "Ignore"], answer: 0 },
  { question: "You enjoy speaking in front of large groups.", options: ["True", "False"], answer: 0 },
  { question: "Puzzle preference?", options: ["Logic grids", "Chess", "Rubik's cube", "Riddles"], answer: 2 },
  { question: "Meme style you laugh at most?", options: ["Dark humor", "Coding memes", "Absurd memes", "Roasts"], answer: 0 },
  { question: "Biggest productivity killer?", options: ["Phone", "YouTube", "Overthinking", "Laziness"], answer: 1 },
  { question: "File naming style?", options: ["Super clean", "Kinda clean", "Total chaos", "Depends on mood"], answer: 1 },
  { question: "You make handwritten notes regularly.", options: ["True", "False"], answer: 0 },
  { question: "One app you use most daily?", options: ["YouTube", "VS Code", "Terminal", "Messaging app"], answer: 0 },
  { question: "Notifications setting?", options: ["Always on", "Important only", "Mostly off", "Flight mode often"], answer: 2 },
  { question: "Favorite weather?", options: ["Rainy", "Cold", "Sunny", "Stormy/cloudy"], answer: 2 },
  { question: "Dream place to visit?", options: ["Japan", "USA", "Europe", "Other"], answer: 3 },
  { question: "Debate strategy?", options: ["Facts/data", "Logic traps", "Calm persuasion", "Aggressive style"], answer: 1 },
  { question: "You sometimes wait till the last day to finish tasks.", options: ["True", "False"], answer: 0 },
  { question: "If you had a pet:", options: ["Dog", "Cat", "Bird", "None"], answer: 2 },
  { question: "Coding snack choice?", options: ["Chips", "Biscuits", "Fruits", "No snacks"], answer: 3 },
  { question: "School break vibe?", options: ["Talk with friends", "Read/watch stuff", "Wander around", "Practice debate"], answer: 0 },
  { question: "Ideal Saturday?", options: ["Build project", "Game all day", "Go out", "Sleep/rest"], answer: 0 },
  { question: "What annoys you most?", options: ["Slow internet", "Bad UI", "People acting dumb", "Wasted time"], answer: 2 },
  { question: "You usually re-read messages before sending.", options: ["True", "False"], answer: 1 },
  { question: "Team role you naturally take:", options: ["Leader", "Builder", "Researcher", "Critic"], answer: 3 },
  { question: "Favorite compliment to hear?", options: ["Smart", "Disciplined", "Creative", "Fearless"], answer: 0 },
  { question: "After school your energy is:", options: ["High", "Medium", "Low", "Unpredictable"], answer: 1 },
  { question: "Skill to max this year?", options: ["AI/ML", "Communication", "Math", "Discipline"], answer: 2 },
  { question: "You keep backup plans for important goals.", options: ["True", "False"], answer: 1 },
  { question: "In games you pick:", options: ["Tactical/stealth", "Aggressive fighter", "Support/utility", "Mixed"], answer: 3 },
  { question: "Movie ending preference?", options: ["Happy", "Dark", "Mind-bending", "Open ending"], answer: 2 },
  { question: "Favorite non-black tone?", options: ["Blue", "Orange", "Red", "Green"], answer: 0 },
  { question: "If you lose a debate:", options: ["Analyze mistakes", "Get mad", "Move on fast", "Demand rematch"], answer: 1 },
  { question: "You enjoy routine and structure.", options: ["True", "False"], answer: 1 },
  { question: "If you mastered one instrument:", options: ["Guitar", "Piano", "Drums", "Flute"], answer: 0 },
  { question: "Dream startup type?", options: ["AI tools", "EdTech", "Gaming tech", "Cybersecurity"], answer: 0 },
  { question: "Friends describe you as:", options: ["Intense", "Funny", "Reliable", "Unpredictable"], answer: 1 },
  { question: "Exam style?", options: ["Early prep", "Steady prep", "Last-minute grind", "Instinct + luck"], answer: 3 },
  { question: "You like unexpected surprises in real life.", options: ["True", "False"], answer: 0 },
  { question: "Best personal motto?", options: ["Build daily", "Stay dangerous", "Discipline > mood", "Outsmart chaos"], answer: 3 },
  { question: "Ideal birthday plan?", options: ["Small close circle", "Big party", "Solo chill", "Build + celebrate"], answer: 2 },
  { question: "Hidden question type you want most?", options: ["Personal habits", "Funny school moments", "Secret opinions", "Mixed chaos"], answer: 3 },
  { question: "Launch pulse message says it launches from:", options: ["Gongabu", "Mars", "Nepal", "Matrix"], answer: 1 },
  { question: "Drop Insight button does what to pulse chain?", options: ["Adds +5 pulses", "Resets chain", "Starts music", "Turns on matrix"], answer: 1 },
  { question: "At 5 pulses, which mode unlocks?", options: ["ISTJ Grid", "Chill Music", "Elon Warp", "Matrix Rain"], answer: 2 },
  { question: "At 10 pulses, which mode unlocks?", options: ["Chill Music", "Elon Warp", "Matrix Rain", "ISTJ Grid"], answer: 0 },
  { question: "At 15 pulses, which mode unlocks?", options: ["Matrix Rain", "ISTJ Grid", "Chill Music", "Elon Warp"], answer: 1 },
  { question: "At 20 pulses, which mode unlocks?", options: ["ISTJ Grid", "Elon Warp", "Matrix Rain", "Chill Music"], answer: 2 },
  { question: "GitHub profile featured on site:", options: ["DevXtechnic", "BikramGole", "NeoCoder", "AuraFarmer"], answer: 0 },
  { question: "Primary footer email uses which domain?", options: ["gmail.com", "proton.me", "keemail.me", "outlook.com"], answer: 2 },
  { question: "Main location shown on site:", options: ["Pokhara", "Gongabu, KTM, Nepal", "Lalitpur", "Bhaktapur"], answer: 1 },
  { question: "Age shown in identity snapshot:", options: ["14", "15", "16", "17"], answer: 1 },
  { question: "Distro and WM listed in About:", options: ["Ubuntu + GNOME", "Fedora + KDE", "Arch + Hyprland", "Debian + i3"], answer: 2 },
  { question: "Goal card in About says:", options: ["Become a game dev", "Become an AI Engineer", "Become a trader", "Become a designer"], answer: 1 },
  { question: "Hero status line says:", options: ["Always online", "Debater mode always ready", "Sleep mode active", "Build mode maybe"], answer: 1 },
  { question: "Movies list includes:", options: ["Interstellar", "Ready Player One", "Inception", "The Dark Knight"], answer: 1 },
  { question: "Games list includes:", options: ["Valorant", "Black Myth: Wukong", "CS2", "Dota 2"], answer: 1 },
  { question: "Anime list includes:", options: ["Jujutsu Kaisen", "Demon Slayer", "Classroom of the Elite", "Bleach"], answer: 2 },
  { question: "Books list includes:", options: ["Atomic Habits", "Sapiens", "1984", "The Alchemist"], answer: 2 },
  { question: "AI leaders card lists:", options: ["Mark Zuckerberg, Sundar Pichai, Satya Nadella", "Sam Altman, Dario Amodei, Elon Musk", "Linus Torvalds, Guido van Rossum, Vitalik Buterin", "Andrew Ng, Ilya Sutskever, Jensen Huang"], answer: 1 },
  { question: "YouTube card lists:", options: ["Luke Smith and Fireship", "Matt Wolfe and AI Explained", "Lex Fridman and Huberman", "MKBHD and Veritasium"], answer: 1 },
  { question: "The penguin tummy badge displays:", options: ["Static </> tag", "Current BS day number", "Current AD month", "CPU usage"], answer: 1 },
  { question: "Quick panel open hint is shown as:", options: ["Ctrl/Cmd + K", "Alt + P", "Ctrl/🐧 + K", "Shift + Space"], answer: 2 },
  { question: "Navbar pages are:", options: ["Home, Projects, Blog", "Home, About, Contact", "About, Works, Contact", "Home only"], answer: 1 },
  { question: "Default site vibe is:", options: ["Light and minimal", "Dark playful space theme", "Corporate white", "Monochrome print style"], answer: 1 },
  { question: "Each quiz run currently asks:", options: ["3 random questions", "5 random questions", "10 random questions", "All questions"], answer: 2 },
  { question: "Launch Pulse includes:", options: ["Only text update", "Visual + sound reaction", "Only sound", "Only matrix effect"], answer: 1 },
  { question: "Which mode adds falling code rain?", options: ["ISTJ mode", "Elon mode", "Matrix mode", "Chill mode"], answer: 2 },
  { question: "The chaos tagline used on site is:", options: ["Aura Farmer", "System Hacker", "Cloud Ninja", "Night Coder"], answer: 0 },
  { question: "Brand name shown in header:", options: ["Bikram", "Aura", "Neo", "DevX"], answer: 2 },
  { question: "Which section fetches repositories from GitHub API?", options: ["Mission Console", "Persona Quiz", "Culture + Brain Fuel", "Live GitHub"], answer: 3 },
  { question: "Which movie in your list is based on a virtual-world competition?", options: ["Nayak", "Ready Player One", "BFG", "The Real Jackpot"], answer: 1 },
  { question: "Which keyboard combo opens the command palette on site?", options: ["Ctrl + P", "Ctrl + J", "Ctrl + K", "Alt + Enter"], answer: 2 },
  { question: "In Black Flag theme, the hero gun appears on which side of title?", options: ["Left", "Right", "Both sides", "It is hidden"], answer: 0 },
  { question: "Which mode label replaced the old Libertarian theme?", options: ["Paper Link", "Neo Blue", "Black Flag Uprising", "Blood Moon"], answer: 2 },
  { question: "What vibe best matches this site?", options: ["Corporate dashboard", "Chaotic fun", "News portal", "Minimal blog"], answer: 1 },
  { question: "Which email is marked as Primary in Contact?", options: ["Develope.genius@gmail.com", "Bikramgole.genius@keemail.me", "neo@matrix.com", "devx@proton.me"], answer: 1 },
  { question: "What does the quiz do when current pool runs out?", options: ["Auto-download more", "Stops and asks reset/refresh", "Repeats previous 10", "Crashes intentionally"], answer: 1 },
  { question: "Which page describes Identity Snapshot?", options: ["Home", "Contact", "About", "All pages"], answer: 2 },
  { question: "Which section title includes the word Console?", options: ["Mission Console", "Open Channel", "Identity Snapshot", "Live GitHub"], answer: 0 },
  { question: "What is the section where custom commands run?", options: ["AI Constellation", "Neo Terminal", "Culture + Brain Fuel", "Direct Links"], answer: 1 },
  { question: "Which item is NOT in your stated interests?", options: ["Linux", "Open source", "Philosophy", "Golf"], answer: 3 },
  { question: "What theme style did you explicitly reject?", options: ["Dark mode", "Light chunky UI", "Space visuals", "Interactive effects"], answer: 1 },
  { question: "Which phrase best describes your debate style from quiz answers?", options: ["Avoid conflict", "Logic traps", "Only humor", "Never defend ideas"], answer: 1 },
  { question: "What is shown under your strengths in About?", options: ["Great English speaker", "Graphic design only", "Cooking", "Photography"], answer: 0 },
  { question: "Which card category appears in Culture + Brain Fuel?", options: ["Podcasts", "Movies", "Travel", "Finance index"], answer: 1 },
  { question: "What is the intended deploy target for this site?", options: ["Heroku", "GitHub Pages", "Netlify Functions only", "Vercel Edge only"], answer: 1 },
  { question: "Which operating style matches your identity line?", options: ["Mac + Finder", "Windows + Explorer", "Arch + Hyprland", "ChromeOS"], answer: 2 },
  { question: "The persona nickname used in branding is:", options: ["Cipher", "Neo", "Agent", "Root"], answer: 1 },
  { question: "What happens at 20 pulse milestone?", options: ["Theme reset", "Matrix Rain", "Quiz reset", "Music off"], answer: 1 },
  { question: "Which card appears in AI + Influence Stack?", options: ["Crypto", "Car collection", "Sports team", "Fitness plan"], answer: 0 },
  { question: "Which section pushes your quote/insight lines with typing effect?", options: ["Mission Console", "Direct Links", "Live GitHub", "Identity Snapshot"], answer: 0 },
];

function triggerPulseBackdrop(clientX = null, clientY = null) {
  const width = window.innerWidth || 1;
  const height = window.innerHeight || 1;
  const x = typeof clientX === "number" && clientX > 0 ? clientX : width * 0.5;
  const y = typeof clientY === "number" && clientY > 0 ? clientY : height * 0.35;

  const layer = document.createElement("div");
  layer.className = "pulse-wave";
  layer.style.setProperty("--pulse-x", `${Math.round((x / width) * 100)}%`);
  layer.style.setProperty("--pulse-y", `${Math.round((y / height) * 100)}%`);

  document.body.appendChild(layer);

  // Force animation start reliably across restricted browsers.
  void layer.offsetWidth;
  layer.classList.add("is-active");
  requestAnimationFrame(() => layer.classList.add("is-active"));

  // Extra visible fallback flash for browsers that suppress blend/animation effects.
  const flash = document.createElement("span");
  flash.className = "pulse-core-flash";
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;
  document.body.appendChild(flash);
  if (typeof flash.animate === "function") {
    flash.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.45)", opacity: 0.9 },
        { transform: "translate(-50%, -50%) scale(3.6)", opacity: 0 },
      ],
      { duration: 420, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "forwards" }
    ).onfinish = () => flash.remove();
  } else {
    window.setTimeout(() => flash.remove(), 450);
  }

  const cleanup = () => layer.remove();
  layer.addEventListener("animationend", cleanup, { once: true });
  window.setTimeout(cleanup, 1150);
}

function playPulseSound(pulseCount = 1) {
  const context = ensureAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const lead = context.createOscillator();
  const sub = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  const accent = (pulseCount % 6) * 22;
  lead.type = "triangle";
  lead.frequency.setValueAtTime(460 + accent, now);
  lead.frequency.exponentialRampToValueAtTime(170, now + 0.2);

  sub.type = "sine";
  sub.frequency.setValueAtTime(90, now);
  sub.frequency.exponentialRampToValueAtTime(52, now + 0.2);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(980, now);
  filter.frequency.exponentialRampToValueAtTime(420, now + 0.2);
  filter.Q.value = 1.1;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.17, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  lead.connect(filter);
  sub.connect(filter);
  filter.connect(gain).connect(context.destination);

  lead.start(now);
  sub.start(now);
  lead.stop(now + 0.24);
  sub.stop(now + 0.24);
}

function triggerPenguinPowerUp() {
  if (!penguinAvatar) return;

  penguinAvatar.classList.remove("power-up");
  // Restart animation if pulses happen quickly.
  void penguinAvatar.offsetWidth;
  penguinAvatar.classList.add("power-up");
  window.setTimeout(() => penguinAvatar.classList.remove("power-up"), 620);
}

function initRuntimeCompatibility() {
  const apply = () => {
    const ua = navigator.userAgent || "";
    const isFirefoxLike = ua.includes("Firefox") || ua.includes("LibreWolf");
    const isVivaldi = /vivaldi/i.test(ua);
    const isSmallViewport = window.matchMedia?.("(max-width: 820px)")?.matches || false;
    const isCoarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches || false;
    const forceTerminalFallback = isSmallViewport || isCoarsePointer;

    document.body.classList.toggle("browser-firefox", isFirefoxLike);
    document.body.classList.toggle("browser-not-firefox", !isFirefoxLike);
    document.body.classList.toggle("browser-vivaldi", isVivaldi);
    document.body.classList.toggle("force-terminal-fallback", forceTerminalFallback);
  };

  apply();
  window.addEventListener("resize", apply);
}

function applyTerminalFontFallbackMode() {
  if (document.body.classList.contains("force-terminal-fallback")) {
    document.body.classList.add("no-nerd-font");
    return;
  }

  const hasNerdFont = NERD_FONT_FAMILIES.some((family) => {
    if (!window?.document?.fonts?.check) return false;
    return window.document.fonts.check(`12px "${family}"`);
  });
  document.body.classList.toggle("no-nerd-font", !hasNerdFont);
}

function initTerminalFontFallbackMode() {
  applyTerminalFontFallbackMode();
  if (window?.document?.fonts?.ready) {
    window.document.fonts.ready
      .then(() => applyTerminalFontFallbackMode())
      .catch(() => {
        // Ignore font readiness failures.
      });
  }
}

function initPenguinDateBadge() {
  if (!penguinBelly) return;

  let lastAdDate = "";

  const getNepalAdDate = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: NEPAL_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;
    return `${year}-${month}-${day}`;
  };

  const parseBsDay = (value) => {
    if (typeof value === "string") {
      const match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
      if (match) return String(Number.parseInt(match[3], 10));
    }

    if (value && typeof value === "object" && "day" in value) {
      return String(Number.parseInt(value.day, 10));
    }

    return null;
  };

  const getFallbackDay = () =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: NEPAL_TIMEZONE,
      day: "numeric",
    }).format(new Date());

  const loadBsConverter = async () => {
    if (adToBsConverter) return adToBsConverter;

    try {
      const module = await import(BS_CONVERTER_URL);
      if (typeof module.ADtoBS === "function") {
        adToBsConverter = module.ADtoBS;
      }
    } catch (error) {
      adToBsConverter = null;
    }

    return adToBsConverter;
  };

  const tick = async () => {
    const adDate = getNepalAdDate();
    if (adDate === lastAdDate && penguinBelly.dataset.day) return;

    let bsDay = null;
    const converter = await loadBsConverter();

    if (converter) {
      try {
        const bsValue = converter(adDate);
        bsDay = parseBsDay(bsValue);
      } catch (error) {
        bsDay = null;
      }
    }

    penguinBelly.dataset.day = bsDay || getFallbackDay();
    lastAdDate = adDate;
  };

  void tick();
  window.setInterval(() => {
    void tick();
  }, 60 * 1000);
}

function applyTheme(theme, notify = false) {
  const selected = THEME_OPTIONS.includes(theme) ? theme : "neo";
  currentTheme = selected;
  document.body.dataset.theme = selected;
  if (headerThemeSelect) headerThemeSelect.value = selected;
  if (heroName) {
    if (selected === "blackflag" && heroName.textContent.trim().length > 0) {
      heroName.classList.add("name-armed");
    } else {
      heroName.classList.remove("name-armed");
    }
  }

  if (miniTerminalTheme) {
    miniTerminalTheme.textContent = `theme: ${selected}`;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, selected);
  } catch (error) {
    // Ignore storage errors.
  }

  setThemeInUrl(selected);
  updateInternalLinks();
  if (notify) showToast(`Theme changed: ${selected}`);
}

function initThemeSwitcher() {
  let savedTheme = "neo";
  let urlTheme = null;
  try {
    urlTheme = getThemeFromUrl();
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    savedTheme = storedTheme || urlTheme || "neo";
    if (!storedTheme && urlTheme) {
      window.localStorage.setItem(THEME_STORAGE_KEY, urlTheme);
    }
  } catch (error) {
    savedTheme = "neo";
  }

  applyTheme(savedTheme, false);
  window.addEventListener("pageshow", () => {
    let latestTheme = "neo";
    try {
      latestTheme = window.localStorage.getItem(THEME_STORAGE_KEY) || getThemeFromUrl() || "neo";
    } catch (error) {
      latestTheme = "neo";
    }
    if (latestTheme !== currentTheme) {
      applyTheme(latestTheme, false);
    }
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== THEME_STORAGE_KEY || !event.newValue) return;
    if (!THEME_OPTIONS.includes(event.newValue)) return;
    if (event.newValue !== currentTheme) {
      applyTheme(event.newValue, false);
    }
  });
  headerThemeSelect?.addEventListener("change", (event) => {
    applyTheme(event.target.value, true);
  });

  themeCycleBtn?.addEventListener("click", () => {
    const idx = THEME_OPTIONS.indexOf(currentTheme);
    const next = THEME_OPTIONS[(idx + 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length];
    applyTheme(next, true);
  });
}

function spawnBlackflagShot(startX, startY, side, targetX = null, targetY = null) {
  const bullet = document.createElement("span");
  bullet.className = "gun-bullet";
  bullet.style.left = `${startX}px`;
  bullet.style.top = `${startY}px`;
  document.body.appendChild(bullet);
  const fallbackX = side === "left" ? startX + window.innerWidth * 0.58 : startX - window.innerWidth * 0.58;
  const fallbackY = startY + (side === "left" ? 6 : -6);
  const endX = Number.isFinite(targetX) ? targetX : fallbackX;
  const endY = Number.isFinite(targetY) ? targetY : fallbackY;
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const distance = Math.max(260, Math.min(920, Math.hypot(dx, dy)));
  const unitX = dx / (Math.hypot(dx, dy) || 1);
  const unitY = dy / (Math.hypot(dx, dy) || 1);
  const travelX = unitX * distance;
  const travelY = unitY * distance;

  bullet.animate(
    [
      { transform: `translate(-50%, -50%) rotate(${angle}deg) scaleX(1)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${travelX}px), calc(-50% + ${travelY}px)) rotate(${angle}deg) scaleX(0.46)`, opacity: 0 },
    ],
    { duration: 340, easing: "cubic-bezier(0.12, 0.77, 0.3, 1)", fill: "forwards" }
  ).onfinish = () => bullet.remove();

  const flash = document.createElement("span");
  flash.className = "gun-flash";
  flash.style.left = `${startX}px`;
  flash.style.top = `${startY}px`;
  document.body.appendChild(flash);
  flash.animate(
    [
      { transform: "translate(-50%, -50%) scale(0.55)", opacity: 0.95 },
      { transform: "translate(-50%, -50%) scale(1.75)", opacity: 0 },
    ],
    { duration: 170, easing: "ease-out", fill: "forwards" }
  ).onfinish = () => flash.remove();
}

function triggerBlackflagBlast(x, y) {
  const pulse = document.createElement("span");
  pulse.className = "gun-flash";
  pulse.style.left = `${x}px`;
  pulse.style.top = `${y}px`;
  pulse.style.width = "66px";
  pulse.style.height = "66px";
  pulse.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(pulse);
  window.setTimeout(() => pulse.remove(), 170);
}

function updateBlackflagGunAim(targetX, targetY, rect) {
  if (!heroName) return;
  const centerX = rect.left + rect.width * 0.5;
  const centerY = rect.top + rect.height * 0.55;
  const tx = Number.isFinite(targetX) ? targetX : centerX;
  const ty = Number.isFinite(targetY) ? targetY : centerY;

  const leftX = rect.left - 26;
  const leftAngle = Math.atan2(ty - centerY, tx - leftX) * (180 / Math.PI);

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const yShift = clamp((ty - centerY) * 0.12, -12, 12);
  const xSwing = clamp((tx - centerX) * 0.02, -8, 8);

  heroName.style.setProperty("--gun-left-angle", `${clamp(leftAngle, -80, 80)}deg`);
  heroName.style.setProperty("--gun-y-shift", `${yShift}px`);
  heroName.style.setProperty("--gun-left-x", `${xSwing}px`);
}

function fireBlackflagShots(event = null) {
  if (currentTheme !== "blackflag") return;
  if (!heroName || !heroName.classList.contains("name-armed")) return;

  const now = performance.now();
  if (now < blackflagShotLockUntil) return;
  blackflagShotLockUntil = now + 160;

  const rect = heroName.getBoundingClientRect();
  const style = window.getComputedStyle(heroName);
  const anchorOffset = Number.parseFloat(style.getPropertyValue("--gun-anchor-x")) || -28;
  const muzzleLen = Number.parseFloat(style.getPropertyValue("--gun-muzzle-len")) || 154;
  const y = rect.top + rect.height * 0.56;
  const leftStockX = rect.left + anchorOffset;
  const tx = Number.isFinite(event?.clientX) ? event.clientX : rect.left + rect.width * 0.5;
  const ty = Number.isFinite(event?.clientY) ? event.clientY : y;

  updateBlackflagGunAim(tx, ty, rect);

  const leftAngleDeg = Math.atan2(ty - y, tx - leftStockX) * (180 / Math.PI);
  const leftAngleRad = (leftAngleDeg * Math.PI) / 180;
  const leftMuzzleX = leftStockX + Math.cos(leftAngleRad) * muzzleLen;
  const leftMuzzleY = y + Math.sin(leftAngleRad) * muzzleLen;

  spawnBlackflagShot(leftMuzzleX, leftMuzzleY, "left", tx, ty);
  if (event?.clientX && event?.clientY) {
    triggerBlackflagBlast(event.clientX, event.clientY);
  }
}

function initBlackflagGunfire() {
  document.addEventListener("click", (event) => {
    fireBlackflagShots(event);
  });
}

function appendTerminalLine(text, type = "out") {
  if (!miniTerminalOutput) return;
  const line = document.createElement("p");
  line.className = `mini-terminal-line ${type}`;
  line.textContent = text;
  miniTerminalOutput.appendChild(line);

  while (miniTerminalOutput.childElementCount > MAX_TERMINAL_LINES) {
    miniTerminalOutput.removeChild(miniTerminalOutput.firstElementChild);
  }

  miniTerminalOutput.scrollTop = miniTerminalOutput.scrollHeight;
}

function clearTerminalOutput() {
  if (!miniTerminalOutput) return;
  miniTerminalOutput.innerHTML = "";
}

function typeTextTo(element, text, speed = 36, prefix = "") {
  if (!element) return;

  const token = (typewriterTokens.get(element) || 0) + 1;
  typewriterTokens.set(element, token);
  element.textContent = prefix;
  let idx = 0;

  const step = () => {
    if (typewriterTokens.get(element) !== token) return;
    idx += 1;
    element.textContent = `${prefix}${text.slice(0, idx)}`;
    if (idx < text.length) window.setTimeout(step, speed);
  };

  if (!text) return;
  window.setTimeout(step, speed);
}

function autocompleteTerminalInput(rawValue) {
  const value = rawValue.trimStart();
  const tokens = value.split(/\s+/);
  const action = tokens[0]?.toLowerCase() || "";
  const arg = tokens.slice(1).join(" ").toLowerCase();

  if (!action) return rawValue;

  if (tokens.length <= 1 && !rawValue.endsWith(" ")) {
    const candidates = TERMINAL_COMMANDS.filter((cmd) => cmd.startsWith(action));
    if (candidates.length === 1) return `${candidates[0]} `;
    return rawValue;
  }

  if (action === "theme") {
    const variants = THEME_OPTIONS;
    const candidates = variants.filter((variant) => variant.startsWith(arg));
    if (candidates.length === 1) return `theme ${candidates[0]}`;
  }

  return rawValue;
}

function runTerminalCommand(rawCommand) {
  const command = rawCommand.trim();
  if (!command) return;

  appendTerminalLine(`${MINI_PROMPT} ${command}`, "cmd");
  const [actionRaw, ...rest] = command.split(/\s+/);
  const action = actionRaw.toLowerCase();
  const arg = rest.join(" ");
  const argLower = arg.toLowerCase();

  if (action === "help") {
    appendTerminalLine("Commands:");
    appendTerminalLine("core: help, whoami, mission, status, clear");
    appendTerminalLine("profile: stack, skills, age, location, school, goal, motto");
    appendTerminalLine("media: books, movies, games, anime, crypto, people, youtube");
    appendTerminalLine("actions: launch, insight, quote, matrix, music, elon, istj, reset, quiz");
    appendTerminalLine(`theme: theme, theme <name> (${THEME_OPTIONS.join(", ")})`);
    appendTerminalLine("nav: home, about, contact, github");
    appendTerminalLine("shell fun: ls, pwd, uname, nepal, date, time, pulse, echo <text>");
  } else if (action === "whoami") {
    appendTerminalLine("Bikram Gole | Aura Farmer");
  } else if (action === "mission") {
    appendTerminalLine("Mission: become an AI engineer and ship useful projects.");
  } else if (action === "status") {
    appendTerminalLine(`Signals launched: ${launches}. Theme: ${currentTheme}.`);
  } else if (action === "stack" || action === "skills") {
    appendTerminalLine("Stack: Python, C/C++, Linux, AI tools, open source.");
  } else if (action === "age") {
    appendTerminalLine("Age: 15");
  } else if (action === "location") {
    appendTerminalLine("Location: Gongabu, KTM, Nepal.");
  } else if (action === "school") {
    appendTerminalLine("School: Shivapuri Secondary School.");
  } else if (action === "goal") {
    appendTerminalLine("Goal: AI Engineer.");
  } else if (action === "motto") {
    appendTerminalLine("Motto: Outsmart chaos.");
  } else if (action === "books") {
    appendTerminalLine("Books: 1984, Can't Hurt Me, Elon Musk, All Tomorrows, I Have No Mouth and I Must Scream.");
  } else if (action === "movies") {
    appendTerminalLine("Movies: The Matrix, The Monkey King, Robot, 2.0, The Real Jackpot, Nayak, Ready Player One, Squid Game, BFG.");
  } else if (action === "games") {
    appendTerminalLine("Games: Black Myth: Wukong, Minecraft, Detroit: Become Human.");
  } else if (action === "anime") {
    appendTerminalLine("Anime: Death Note, Monster, Psycho-Pass, Attack on Titan, Naruto, My Hero Academia, Classroom of the Elite.");
  } else if (action === "crypto") {
    appendTerminalLine("Crypto: BTC, Ethereum, Monero, Solana.");
  } else if (action === "people") {
    appendTerminalLine("People: Sam Altman, Dario Amodei, Elon Musk, Linus Torvalds, Terry A. Davis.");
  } else if (action === "youtube") {
    appendTerminalLine("YouTube: AI Explained, Matt Wolfe, Luke Smith, Mental Outlaw, Linus Tech Tips, IN-Depth Story, HowToMen, The Linux Experiment, Fireship.");
  } else if (action === "launch") {
    launchBtn?.click();
    appendTerminalLine("Launch pulse fired.");
  } else if (action === "insight" || action === "quote") {
    quoteBtn?.click();
    appendTerminalLine("Dropped new insight.");
  } else if (action === "matrix") {
    toggleMatrixMode();
    appendTerminalLine("Matrix mode toggled.");
  } else if (action === "music") {
    toggleFunkAudio();
    appendTerminalLine("Chill music toggled.");
  } else if (action === "elon") {
    toggleElonMode();
    appendTerminalLine("Elon warp toggled.");
  } else if (action === "istj") {
    toggleISTJMode();
    appendTerminalLine("ISTJ grid toggled.");
  } else if (action === "reset") {
    resetPulseChain();
    appendTerminalLine("Pulse chain reset.");
  } else if (action === "quiz") {
    startPersonaQuiz?.();
    appendTerminalLine("Quiz sequence initiated.");
  } else if (action === "theme") {
    if (argLower) {
      if (argLower === "random") {
        const candidates = THEME_OPTIONS.filter((name) => name !== currentTheme);
        const pick = candidates[Math.floor(Math.random() * candidates.length)] || "neo";
        applyTheme(pick, true);
        appendTerminalLine(`Applied random theme: ${pick}.`);
      } else if (THEME_OPTIONS.includes(argLower)) {
        applyTheme(argLower, true);
        appendTerminalLine(`Applied theme: ${argLower}.`);
      } else {
        appendTerminalLine(`Invalid theme. Use: random, ${THEME_OPTIONS.join(", ")}.`, "warn");
      }
    } else {
      appendTerminalLine(`Current theme: ${currentTheme}.`);
    }
  } else if (action === "home") {
    scrollToSection("hero-zone");
    appendTerminalLine("Jumped to home.");
  } else if (action === "about") {
    navigateToPage("about.html");
  } else if (action === "contact") {
    navigateToPage("contact.html");
  } else if (action === "github") {
    window.open("https://github.com/DevXtechnic", "_blank", "noopener,noreferrer");
    appendTerminalLine("Opened GitHub profile.");
  } else if (action === "ls") {
    appendTerminalLine("sections: hero-zone mission-console ai-constellation culture-brain neo-terminal persona-quiz github-live");
  } else if (action === "pwd") {
    appendTerminalLine("/home/neo/aura-site");
  } else if (action === "uname") {
    appendTerminalLine("Arch Linux + Hyprland");
  } else if (action === "nepal") {
    appendTerminalLine("Timezone: Asia/Kathmandu | Base: Gongabu, KTM, Nepal");
  } else if (action === "date" || action === "time") {
    appendTerminalLine(new Date().toLocaleString("en-US"));
  } else if (action === "pulse") {
    appendTerminalLine(`Current pulse count: ${launches}`);
  } else if (action === "echo") {
    appendTerminalLine(arg || "");
  } else if (action === "clear") {
    clearTerminalOutput();
  } else {
    appendTerminalLine(`Unknown command: ${action}. Use "help".`, "warn");
  }
}

function initMiniTerminal() {
  if (!miniTerminalForm || !miniTerminalInput) return;

  clearTerminalOutput();
  appendTerminalLine("kitty-like shell initialized.");
  appendTerminalLine("Type \"help\" for commands | ↑/↓ history | Tab autocomplete | Ctrl+L clear.");
  appendTerminalLine(`Current theme: ${currentTheme}.`);
  terminalHistory = [];
  terminalHistoryIndex = 0;
  terminalDraft = "";

  miniTerminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = miniTerminalInput.value;
    miniTerminalInput.value = "";
    const trimmed = value.trim();
    if (trimmed) {
      terminalHistory.push(trimmed);
      if (terminalHistory.length > 120) terminalHistory.shift();
    }
    terminalHistoryIndex = terminalHistory.length;
    terminalDraft = "";
    runTerminalCommand(value);
    miniTerminalInput.focus();
  });

  miniTerminalInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!terminalHistory.length) return;
      if (terminalHistoryIndex === terminalHistory.length) {
        terminalDraft = miniTerminalInput.value;
      }
      terminalHistoryIndex = Math.max(0, terminalHistoryIndex - 1);
      miniTerminalInput.value = terminalHistory[terminalHistoryIndex] || "";
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!terminalHistory.length) return;
      terminalHistoryIndex = Math.min(terminalHistory.length, terminalHistoryIndex + 1);
      if (terminalHistoryIndex === terminalHistory.length) {
        miniTerminalInput.value = terminalDraft;
      } else {
        miniTerminalInput.value = terminalHistory[terminalHistoryIndex] || "";
      }
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      miniTerminalInput.value = autocompleteTerminalInput(miniTerminalInput.value);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      clearTerminalOutput();
      appendTerminalLine("screen cleared.");
      return;
    }
  });

  miniTerminalScreen?.addEventListener("click", () => {
    miniTerminalInput.focus();
  });
}

function initHeroTypewriters() {
  if (page !== "home") return;
  const fullName = heroName?.dataset.name || heroName?.textContent || "";
  const statusLines = [
    "Debater mode always active ⚔️",
    "Debater mode always ready...",
    "Aura farmer channel open 🚀",
    "AI engineer loading...",
    "Linux + Arch + Hyprland mode on 🐧",
    "Open source first, excuses never.",
    "I build, break, fix, repeat.",
    "Ctrl + focus + consistency.",
    "Future AI engineer in progress.",
    "Debate me on anything.",
    "Signal over noise, always.",
    "Coffee in, code out ☕",
    "Rubik brain unlocked 🧩",
    "Chaotic fun, clean logic.",
    "Typing fast, thinking faster.",
    "No sleep, more shipping.",
    "Code. Learn. Iterate.",
    "From Gongabu to global ideas.",
    "Matrix mindset online.",
    "Aura farming at max power.",
    "Terminal comfort zone active.",
    "Build in public, grow in public.",
    "Deep work session running...",
    "Ship today, improve tomorrow.",
    "AI + Linux + discipline.",
    "Small wins, big momentum.",
    "Debater mode: evidence only.",
    "Focus protocol engaged.",
    "Curiosity > comfort.",
    "Keep moving. Keep building.",
  ];

  let nameFinished = false;
  let shouldTypeName = true;
  try {
    const navEntry = performance.getEntriesByType("navigation")[0];
    if (navEntry?.type === "reload") {
      window.sessionStorage.removeItem(HERO_TYPED_KEY);
    }
    if (window.sessionStorage.getItem(HERO_TYPED_KEY) === "1") {
      shouldTypeName = false;
    } else {
      window.sessionStorage.setItem(HERO_TYPED_KEY, "1");
    }
  } catch (error) {
    shouldTypeName = true;
  }

  if (heroName) {
    if (!shouldTypeName) {
      heroName.textContent = fullName;
      if (document.body.dataset.theme === "blackflag") {
        window.setTimeout(() => heroName.classList.add("name-armed"), 80);
      }
      nameFinished = true;
    } else {
      heroName.textContent = "";
      heroName.classList.remove("name-armed");
      let index = 0;
      const typeName = () => {
        index += 1;
        heroName.textContent = fullName.slice(0, index);
        if (index < fullName.length) {
          window.setTimeout(typeName, 140);
        } else {
          if (document.body.dataset.theme === "blackflag") {
            window.setTimeout(() => heroName.classList.add("name-armed"), 120);
          }
          nameFinished = true;
        }
      };
      window.setTimeout(typeName, 120);
    }
  } else {
    nameFinished = true;
  }

  if (!heroStatus) return;

  heroStatus.textContent = "";
  let lineIndex = Math.floor(Math.random() * statusLines.length);
  let charIndex = 0;
  let deleting = false;

  const loopStatus = () => {
    if (!nameFinished) {
      window.setTimeout(loopStatus, 80);
      return;
    }

    const currentLine = statusLines[lineIndex];

    if (!deleting) {
      charIndex += 1;
      heroStatus.textContent = currentLine.slice(0, charIndex);
      if (charIndex < currentLine.length) {
        window.setTimeout(loopStatus, 68);
      } else {
        deleting = true;
        window.setTimeout(loopStatus, 850);
      }
      return;
    }

    charIndex -= 1;
    heroStatus.textContent = charIndex > 0 ? currentLine.slice(0, charIndex) : "\u00A0";
    if (charIndex > 0) {
      window.setTimeout(loopStatus, 40);
      return;
    }

    deleting = false;
    if (statusLines.length > 1) {
      let nextIndex = lineIndex;
      while (nextIndex === lineIndex) {
        nextIndex = Math.floor(Math.random() * statusLines.length);
      }
      lineIndex = nextIndex;
    }
    window.setTimeout(loopStatus, 120);
  };

  window.setTimeout(loopStatus, 360);
}

function initFooterLineTypewriter() {
  if (!pageFooterLine) return;
  if (page === "about") {
    const pick = aboutFooterLines[Math.floor(Math.random() * aboutFooterLines.length)];
    pageFooterLine.dataset.text = pick;
  }
  const text = pageFooterLine.dataset.text || pageFooterLine.textContent || "";
  pageFooterLine.textContent = "";
  typeTextTo(pageFooterLine, text, 38, "");
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getThemeFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get("theme");
    return THEME_OPTIONS.includes(urlTheme) ? urlTheme : null;
  } catch (error) {
    return null;
  }
}

function setThemeInUrl(theme) {
  try {
    const url = new URL(window.location.href);
    if (THEME_OPTIONS.includes(theme)) {
      url.searchParams.set("theme", theme);
    } else {
      url.searchParams.delete("theme");
    }
    window.history.replaceState(null, "", url.toString());
  } catch (error) {
    // ignore
  }
}

function applyThemeToUrl(urlString, theme) {
  try {
    const url = new URL(urlString, window.location.href);
    if (THEME_OPTIONS.includes(theme)) {
      url.searchParams.set("theme", theme);
    } else {
      url.searchParams.delete("theme");
    }
    return url.toString();
  } catch (error) {
    return urlString;
  }
}

function updateInternalLinks() {
  const theme = THEME_OPTIONS.includes(currentTheme) ? currentTheme : "neo";
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("mailto:") || href.startsWith("http") || href.startsWith("#")) return;
    if (link.getAttribute("target") === "_blank") return;
    if (!href.includes(".html")) return;
    link.setAttribute("href", applyThemeToUrl(href, theme));
  });
}

function triggerAction(actionKey) {
  if (actionKey === "launch") launchBtn?.click();
  if (actionKey === "insight") quoteBtn?.click();
  if (actionKey === "quiz") startPersonaQuiz?.();
}

function runOrNavigate(sectionId, actionKey = "") {
  const target = sectionId ? document.getElementById(sectionId) : null;
  if (target) {
    scrollToSection(sectionId);
    if (sectionId === "neo-terminal") {
      window.setTimeout(() => miniTerminalInput?.focus(), 220);
    }
    if (actionKey) triggerAction(actionKey);
    return;
  }

  if (actionKey) sessionStorage.setItem(ACTION_STORAGE_KEY, actionKey);
  const hash = sectionId ? `#${sectionId}` : "";
  const targetUrl = applyThemeToUrl(`index.html${hash}`, currentTheme);
  window.location.href = targetUrl;
}

function navigateToPage(path) {
  const nextUrl = applyThemeToUrl(path, currentTheme);
  window.location.href = nextUrl;
}

function initAiConstellationTagline() {
  if (page !== "home") return;
  const tagEl = document.querySelector("#ai-constellation .chaos-card.c4 p");
  if (!tagEl) return;
  const pick = aiConstellationTaglines[Math.floor(Math.random() * aiConstellationTaglines.length)];
  tagEl.textContent = pick;
}

function focusTerminalIfNeeded() {
  if (page !== "home") return;
  if (window.location.hash === "#neo-terminal") {
    window.setTimeout(() => miniTerminalInput?.focus(), 240);
  }
}

function ensureCommandPaletteElements() {
  if (commandPalette && commandBackdrop && commandInput && commandResults) return;

  const wrapper = document.createElement("div");
  wrapper.id = "command-palette";
  wrapper.className = "command-palette";
  wrapper.setAttribute("aria-hidden", "true");
  wrapper.innerHTML = `
    <button id="command-backdrop" class="command-backdrop" type="button" aria-label="Close command palette"></button>
    <div class="command-shell" role="dialog" aria-modal="true" aria-labelledby="command-title">
      <div class="command-head">
        <div class="command-title-wrap">
          <span class="linux-mark" aria-hidden="true"></span>
          <h3 id="command-title">Ctrl/🐧 + K Panel</h3>
        </div>
        <span>Neo Ops</span>
      </div>
      <input id="command-input" type="text" placeholder="Type command: quiz, github, matrix..." autocomplete="off" />
      <div id="command-results" class="command-results" role="listbox" aria-label="command results"></div>
      <p class="command-hint">Tip: <kbd>Ctrl/🐧 + K</kbd> to open, <kbd>Esc</kbd> to close.</p>
    </div>
  `;

  document.body.appendChild(wrapper);
  commandPalette = wrapper;
  commandBackdrop = wrapper.querySelector("#command-backdrop");
  commandInput = wrapper.querySelector("#command-input");
  commandResults = wrapper.querySelector("#command-results");
}

function initCommandPalette() {
  ensureCommandPaletteElements();
  if (!commandPalette || !commandInput || !commandResults) return;

  const commands = [
    { label: "Go: Hero", keywords: "home hero top", run: () => runOrNavigate("hero-zone") },
    { label: "Go: Mission Console", keywords: "mission pulse console", run: () => runOrNavigate("mission-console") },
    { label: "Go: AI Constellation", keywords: "ai constellation leaders", run: () => runOrNavigate("ai-constellation") },
    { label: "Go: Culture + Brain Fuel", keywords: "movies games anime books", run: () => runOrNavigate("culture-brain") },
    { label: "Go: Neo Terminal", keywords: "terminal shell commands", run: () => runOrNavigate("neo-terminal") },
    { label: "Go: Persona Quiz", keywords: "quiz game persona", run: () => runOrNavigate("persona-quiz") },
    { label: "Go: Live GitHub", keywords: "github repos projects", run: () => runOrNavigate("github-live") },
    { label: "Action: Launch Pulse", keywords: "pulse launch aura", run: () => runOrNavigate("mission-console", "launch") },
    { label: "Action: Drop Insight", keywords: "insight quote drop", run: () => runOrNavigate("mission-console", "insight") },
    { label: "Action: Start Persona Quiz", keywords: "quiz start challenge", run: () => runOrNavigate("persona-quiz", "quiz") },
    { label: "Theme: Neo Blue", keywords: "theme neo blue", run: () => applyTheme("neo", true) },
    { label: "Theme: Mint Matrix", keywords: "theme mint green", run: () => applyTheme("mint", true) },
    { label: "Theme: Sunset Warp", keywords: "theme sunset orange", run: () => applyTheme("sunset", true) },
    { label: "Theme: Liquid Glass", keywords: "theme liquid glass apple", run: () => applyTheme("liquidglass", true) },
    { label: "Theme: Paper Link", keywords: "theme paper", run: () => applyTheme("paper", true) },
    { label: "Theme: Black Flag Uprising", keywords: "theme blackflag anarchy", run: () => applyTheme("blackflag", true) },
    { label: "Mode: Toggle Matrix Rain", keywords: "matrix rain mode", run: () => toggleMatrixMode() },
    { label: "Mode: Toggle Chill Music", keywords: "music chill funk mode", run: () => toggleFunkAudio() },
    { label: "Mode: Toggle Elon Warp", keywords: "elon warp mode", run: () => toggleElonMode() },
    { label: "Open: GitHub Profile", keywords: "github profile devxtechnic", run: () => window.open("https://github.com/DevXtechnic", "_blank", "noopener,noreferrer") },
    { label: "Open: About Page", keywords: "about page profile", run: () => navigateToPage("about.html") },
    { label: "Open: Contact Page", keywords: "contact email", run: () => navigateToPage("contact.html") },
  ];

  let visibleCommands = commands.slice();
  let activeIndex = 0;

  const openPalette = () => {
    commandPalette.classList.add("open");
    commandPalette.setAttribute("aria-hidden", "false");
    commandInput.value = "";
    renderCommands("");
    window.setTimeout(() => commandInput.focus(), 20);
  };

  const closePalette = () => {
    commandPalette.classList.remove("open");
    commandPalette.setAttribute("aria-hidden", "true");
  };

  const runCommand = (command) => {
    closePalette();
    command.run();
  };

  const renderCommands = (query) => {
    const q = query.trim().toLowerCase();
    visibleCommands = q
      ? commands.filter((cmd) => (`${cmd.label} ${cmd.keywords}`).toLowerCase().includes(q))
      : commands.slice();

    if (activeIndex >= visibleCommands.length) activeIndex = 0;
    commandResults.innerHTML = "";

    if (visibleCommands.length === 0) {
      const empty = document.createElement("p");
      empty.className = "command-empty";
      empty.textContent = "No command matched. Try: quiz, github, matrix, pulse.";
      commandResults.appendChild(empty);
      return;
    }

    visibleCommands.forEach((cmd, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = `command-item${index === activeIndex ? " active" : ""}`;
      item.textContent = cmd.label;
      item.setAttribute("role", "option");
      item.addEventListener("click", () => runCommand(cmd));
      commandResults.appendChild(item);
    });
  };

  paletteOpenBtn?.addEventListener("click", openPalette);
  commandBackdrop?.addEventListener("click", closePalette);

  commandInput.addEventListener("input", (event) => {
    activeIndex = 0;
    renderCommands(event.target.value);
  });

  commandInput.addEventListener("keydown", (event) => {
    if (!visibleCommands.length) {
      if (event.key === "Escape") closePalette();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % visibleCommands.length;
      renderCommands(commandInput.value);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + visibleCommands.length) % visibleCommands.length;
      renderCommands(commandInput.value);
    } else if (event.key === "Enter") {
      event.preventDefault();
      runCommand(visibleCommands[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (commandPalette.classList.contains("open")) {
        closePalette();
      } else {
        openPalette();
      }
      return;
    }

    if (event.key === "Escape" && commandPalette.classList.contains("open")) {
      closePalette();
    }
  });
}

function initPersonaQuiz() {
  if (!quizQuestion || !quizProgress || !quizOptions || !quizStartBtn || !quizResetBtn || !quizScore) return;

  const SESSION_SIZE = 10;
  let questions = [];
  let index = 0;
  let score = 0;
  let answered = false;
  let remainingQuestions = [];

  const resetQuestionPool = () => {
    remainingQuestions = personaQuizQuestions
      .map((entry) => ({ sort: Math.random(), value: entry }))
      .sort((a, b) => a.sort - b.sort)
      .map((entry) => entry.value);
  };

  const setIdleState = (withPoolReset = false) => {
    if (withPoolReset || remainingQuestions.length === 0) {
      resetQuestionPool();
    }

    questions = [];
    index = 0;
    score = 0;
    answered = false;
    quizQuestion.textContent = "Hit start and prove your Neo-level awareness.";
    quizProgress.textContent = `Ready. ${personaQuizQuestions.length}-question bank loaded. ${remainingQuestions.length} unused.`;
    quizScore.textContent = "Score: 0/0";
    quizOptions.innerHTML = "";
  };

  const renderQuestion = () => {
    const current = questions[index];
    if (!current) return;

    answered = false;
    quizProgress.textContent = `Question ${index + 1} of ${questions.length}`;
    quizQuestion.textContent = current.question;
    quizScore.textContent = `Score: ${score}/${questions.length}`;
    quizOptions.innerHTML = "";

    current.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        const correct = optionIndex === current.answer;
        if (correct) {
          score += 1;
          button.classList.add("good");
          spawnSparks(8);
          showToast("Correct. Aura up.");
        } else {
          button.classList.add("bad");
          showToast("Wrong answer. Recovery mode.");
        }

        const allButtons = quizOptions.querySelectorAll("button");
        allButtons.forEach((item, idx) => {
          item.disabled = true;
          if (idx === current.answer) item.classList.add("answer");
        });

        window.setTimeout(() => {
          index += 1;
          if (index >= questions.length) {
            quizProgress.textContent = `Quiz complete. ${remainingQuestions.length} unused left.`;
            quizQuestion.textContent =
              score >= questions.length - 1
                ? "Elite run. You know the Aura Farmer lore."
                : score >= 3
                  ? "Solid run. You know most of the lore."
                  : "Low aura memory. Run it again.";
            quizScore.textContent = `Final Score: ${score}/${questions.length}`;
            quizOptions.innerHTML = "";
          } else {
            renderQuestion();
          }
        }, 700);
      });
      quizOptions.appendChild(button);
    });
  };

  const startQuiz = () => {
    if (remainingQuestions.length < SESSION_SIZE) {
      quizProgress.textContent = `Only ${remainingQuestions.length} unused left. Press Reset Quiz or refresh.`;
      quizQuestion.textContent = "Question bank exhausted for this run.";
      quizScore.textContent = "Score: 0/0";
      quizOptions.innerHTML = "";
      return;
    }

    questions = remainingQuestions.splice(0, SESSION_SIZE);
    index = 0;
    score = 0;
    renderQuestion();
  };

  quizStartBtn.addEventListener("click", startQuiz);
  quizResetBtn.addEventListener("click", () => setIdleState(true));
  startPersonaQuiz = () => {
    scrollToSection("persona-quiz");
    startQuiz();
  };

  setIdleState(true);
}

initPenguinDateBadge();
initThemeSwitcher();
initHeroTypewriters();
initBlackflagGunfire();
initRuntimeCompatibility();
initTerminalFontFallbackMode();
initMiniTerminal();
initCommandPalette();
initPersonaQuiz();
initAiConstellationTagline();
focusTerminalIfNeeded();

const pendingAction = sessionStorage.getItem(ACTION_STORAGE_KEY);
if (pendingAction) {
  sessionStorage.removeItem(ACTION_STORAGE_KEY);
  window.setTimeout(() => triggerAction(pendingAction), 180);
}

if (quoteBtn && quoteOutput) {
  quoteBtn.addEventListener("click", () => {
    const pick = quotes[Math.floor(Math.random() * quotes.length)];
    typeTextTo(quoteOutput, pick, 18, "> ");
    if (heroTagline) {
      const current = heroTagline.textContent.trim();
      const candidates = heroTaglineVariants.filter((tag) => tag !== current);
      const nextTag = candidates[Math.floor(Math.random() * candidates.length)] || heroTaglineVariants[0];
      typeTextTo(heroTagline, nextTag, 22, "");
    }
    if (currentTheme === "blackflag") {
      const rect = quoteBtn.getBoundingClientRect();
      triggerBlackflagBlast(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
    }
    resetPulseChain();
  });
}

if (launchBtn && quoteOutput && signalCount) {
  launchBtn.addEventListener("click", (event) => {
    launches += 1;
    signalCount.textContent = String(launches);
    quoteOutput.textContent = `> Aura pulse ${launches} launched from Mars.`;
    triggerPulseBackdrop(event?.clientX, event?.clientY);
    playPulseSound(launches);
    triggerPenguinPowerUp();
    spawnSparks(24);
    if (currentTheme === "blackflag") {
      triggerBlackflagBlast(event?.clientX || window.innerWidth * 0.5, event?.clientY || window.innerHeight * 0.5);
    }
    applyPulseMilestone(launches);
  });
}

async function loadRepos() {
  const grid = document.getElementById("repo-grid");
  if (!grid) return;

  grid.innerHTML = "<p>Loading repos...</p>";
  try {
    const response = await fetch("https://api.github.com/users/DevXtechnic/repos?sort=updated&per_page=6");
    if (!response.ok) throw new Error("GitHub API request failed");

    const repos = await response.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      grid.innerHTML = "<p>No public repos found yet. Check back soon.</p>";
      return;
    }

    grid.innerHTML = repos
      .map(
        (repo) => `
          <article class="repo-card tilt">
            <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
            <p>${repo.description || "No description yet."}</p>
            <p class="repo-meta">${repo.language || "Code"} | ${repo.stargazers_count} stars</p>
          </article>
        `
      )
      .join("");

    document.querySelectorAll(".repo-card.tilt").forEach((card) => {
      const reset = () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      };
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const dx = (event.clientX - rect.left) / rect.width - 0.5;
        const dy = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${(-dy * 5).toFixed(2)}deg) rotateY(${(dx * 6).toFixed(2)}deg)`;
        card.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
      card.addEventListener("mouseleave", reset);
    });
  } catch (err) {
    grid.innerHTML = '<p>Could not load live repos now. Visit <a href="https://github.com/DevXtechnic" target="_blank" rel="noopener noreferrer">GitHub profile</a>.</p>';
  }
}

loadRepos();
initFooterLineTypewriter();

function showToast(message) {
  let toast = document.querySelector(".easter-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "easter-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function spawnSparks(total) {
  for (let i = 0; i < total; i += 1) {
    window.setTimeout(() => {
      const spark = document.createElement("span");
      spark.className = "spark";
      spark.style.left = `${Math.random() * 98}vw`;
      spark.style.setProperty("--dx", `${Math.random() * 110 - 55}px`);
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 1200);
    }, i * 38);
  }
}

let matrixCanvas = null;
let matrixContext = null;
let matrixAnimation = null;
let matrixDrops = [];
let matrixResizeHandler = null;

function startMatrixRain() {
  if (matrixCanvas) {
    document.body.classList.add("matrix-mode");
    return;
  }

  matrixCanvas = document.createElement("canvas");
  matrixCanvas.className = "matrix-layer";
  document.body.appendChild(matrixCanvas);
  matrixContext = matrixCanvas.getContext("2d");

  matrixResizeHandler = () => {
    if (!matrixCanvas || !matrixContext) return;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const columns = Math.floor(matrixCanvas.width / 14);
    matrixDrops = Array.from({ length: columns }, () => Math.random() * matrixCanvas.height);
  };

  matrixResizeHandler();
  window.addEventListener("resize", matrixResizeHandler);

  const chars = "01{}[]<>/\\|$#@";
  const draw = () => {
    if (!matrixCanvas || !matrixContext) return;

    matrixContext.fillStyle = "rgba(0, 0, 0, 0.08)";
    matrixContext.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    matrixContext.fillStyle = "#73ff86";
    matrixContext.font = "13px monospace";

    matrixDrops.forEach((drop, index) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = index * 14;
      matrixContext.fillText(char, x, drop);
      matrixDrops[index] = drop > matrixCanvas.height && Math.random() > 0.98 ? 0 : drop + 10;
    });

    matrixAnimation = requestAnimationFrame(draw);
  };

  document.body.classList.add("matrix-mode");
  draw();
}

function stopMatrixRain() {
  document.body.classList.remove("matrix-mode");
  if (matrixAnimation) cancelAnimationFrame(matrixAnimation);
  matrixAnimation = null;

  if (matrixResizeHandler) {
    window.removeEventListener("resize", matrixResizeHandler);
    matrixResizeHandler = null;
  }

  if (matrixCanvas) matrixCanvas.remove();
  matrixCanvas = null;
  matrixContext = null;
  matrixDrops = [];
}

let audioCtx = null;
let funkTimer = null;
let funkStep = 0;
let noiseBuffer = null;

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (!noiseBuffer) {
    noiseBuffer = buildNoiseBuffer(audioCtx);
  }

  return audioCtx;
}

// Fixed funk loop patterns (not random music)
const kickPattern = [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0];
const snarePattern = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
const hatPattern = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0];
const bassPattern = [55, 0, 62, 0, 65, 0, 62, 0, 73, 0, 70, 0, 65, 0, 62, 0];

function buildNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 0.25, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playKick(context, time) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(128, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.13);
  gain.gain.setValueAtTime(0.9, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  osc.connect(gain).connect(context.destination);
  osc.start(time);
  osc.stop(time + 0.16);
}

function playSnare(context, time) {
  if (!noiseBuffer) return;

  const noise = context.createBufferSource();
  const noiseGain = context.createGain();
  const filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1800;

  noise.buffer = noiseBuffer;
  noiseGain.gain.setValueAtTime(0.25, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

  noise.connect(filter).connect(noiseGain).connect(context.destination);
  noise.start(time);
  noise.stop(time + 0.13);
}

function playHat(context, time) {
  if (!noiseBuffer) return;

  const noise = context.createBufferSource();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 6200;

  noise.buffer = noiseBuffer;
  gain.gain.setValueAtTime(0.1, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);

  noise.connect(filter).connect(gain).connect(context.destination);
  noise.start(time);
  noise.stop(time + 0.06);
}

function playBass(context, time, freq) {
  const osc = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  osc.type = "square";
  osc.frequency.value = freq;

  filter.type = "lowpass";
  filter.frequency.value = 280;

  gain.gain.setValueAtTime(0.13, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

  osc.connect(filter).connect(gain).connect(context.destination);
  osc.start(time);
  osc.stop(time + 0.17);
}

function runFunkStep() {
  if (!audioCtx) return;

  const time = audioCtx.currentTime + 0.03;
  const step = funkStep % 16;

  if (kickPattern[step]) playKick(audioCtx, time);
  if (snarePattern[step]) playSnare(audioCtx, time);
  if (hatPattern[step]) playHat(audioCtx, time);

  const bassFreq = bassPattern[step];
  if (bassFreq > 0) playBass(audioCtx, time, bassFreq);

  funkStep += 1;
}

function startFunkAudio() {
  ensureAudioContext();
  if (funkTimer) return;

  funkStep = 0;
  const stepMs = 125; // fixed tempo groove
  funkTimer = window.setInterval(runFunkStep, stepMs);
  document.body.classList.add("funk-mode");
}

function stopFunkAudio() {
  if (funkTimer) {
    window.clearInterval(funkTimer);
    funkTimer = null;
  }
  document.body.classList.remove("funk-mode");
}

function toggleFunkAudio() {
  if (funkTimer) {
    stopFunkAudio();
    showToast("Funk reactor off.");
  } else {
    startFunkAudio();
    spawnSparks(22);
    showToast("Funk reactor online.");
  }
}

function toggleISTJMode() {
  document.body.classList.toggle("istj-mode");
  showToast(document.body.classList.contains("istj-mode") ? "ISTJ grid enabled." : "ISTJ grid disabled.");
}

function toggleElonMode() {
  document.body.classList.toggle("elon-mode");
  spawnSparks(14);
  showToast("Elon warp toggled.");
}

function toggleMatrixMode() {
  if (document.body.classList.contains("matrix-mode")) {
    stopMatrixRain();
    showToast("Matrix rain disabled.");
  } else {
    startMatrixRain();
    showToast("Matrix rain enabled.");
  }
}

function applyPulseMilestone(count) {
  if (count === 5) {
    if (!document.body.classList.contains("elon-mode")) toggleElonMode();
    showToast("5 pulses: Elon Warp.");
  } else if (count === 10) {
    if (!funkTimer) toggleFunkAudio();
    showToast("10 pulses: Chill Music.");
  } else if (count === 15) {
    if (!document.body.classList.contains("istj-mode")) toggleISTJMode();
    showToast("15 pulses: ISTJ Grid.");
  } else if (count === 20) {
    if (!document.body.classList.contains("matrix-mode")) toggleMatrixMode();
    showToast("20 pulses: Matrix Rain.");
  }
}

function resetPulseChain() {
  launches = 0;
  if (signalCount) signalCount.textContent = "0";

  if (document.body.classList.contains("elon-mode")) {
    document.body.classList.remove("elon-mode");
  }
  if (document.body.classList.contains("istj-mode")) {
    document.body.classList.remove("istj-mode");
  }
  if (document.body.classList.contains("matrix-mode")) {
    stopMatrixRain();
  }
  if (funkTimer) {
    stopFunkAudio();
  }
}

document.getElementById("funk-toggle")?.addEventListener("click", toggleFunkAudio);
