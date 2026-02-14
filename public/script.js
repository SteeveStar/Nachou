// Forcer la lecture de la musique sur mobile après interaction utilisateur (touch/click/bouton)
function playMusicOnMobile() {
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().catch(()=>{});
  }
  document.removeEventListener('touchstart', playMusicOnMobile);
  document.removeEventListener('click', playMusicOnMobile);
}
document.addEventListener('touchstart', playMusicOnMobile);
document.addEventListener('click', playMusicOnMobile);
if (musicToggle) {
  musicToggle.addEventListener('click', playMusicOnMobile);
}
const revealElements = document.querySelectorAll(".reveal");
const loveBtn = document.getElementById("loveBtn");
const timeBtn = document.getElementById("timeBtn");
const loveResult = document.getElementById("loveResult");
const loveLetter = document.getElementById("loveLetter");
const heartBurst = document.getElementById("heartBurst");
const heartField = document.getElementById("heartField");
const sparkleField = document.getElementById("sparkleField");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const petalCanvas = document.getElementById("petalCanvas");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((el) => observer.observe(el));

const hearts = ["❤", "💗", "💖", "💘", "💕"];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const sendClickConfirmation = async (buttonLabel) => {
  try {
    await fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ button: buttonLabel, timestamp: new Date().toISOString() })
    });
  } catch (error) {
    console.error("Email confirmation failed", error);
  }
};

const spawnFloatingHearts = () => {
  for (let i = 0; i < 20; i += 1) {
    const heart = document.createElement("div");
    heart.className = "float-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 10}s`;
    heart.style.fontSize = `${14 + Math.random() * 18}px`;
    heartField.appendChild(heart);
  }
};

const spawnSparkles = () => {
  for (let i = 0; i < 45; i += 1) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 5}s`;
    sparkle.style.opacity = `${0.2 + Math.random() * 0.8}`;
    sparkleField.appendChild(sparkle);
  }
};

const burstHearts = (x, y) => {
  for (let i = 0; i < 24; i += 1) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x + (Math.random() * 120 - 60)}px`;
    heart.style.top = `${y + (Math.random() * 120 - 60)}px`;
    heart.style.fontSize = `${18 + Math.random() * 18}px`;
    heartBurst.appendChild(heart);
    setTimeout(() => heart.remove(), 2800);
  }
};

loveBtn.addEventListener("click", (event) => {
  const rect = loveBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  loveResult.textContent = "Tu as fait de moi l'homme le plus heureux du monde 💖";
  loveResult.removeAttribute('style');
  loveLetter.removeAttribute('style');
  burstHearts(x, y);
  burstHearts(x + 80, y + 20);
  burstHearts(x - 60, y - 20);
  sendClickConfirmation("Je t'aime Steeve ❤️");
});

const movePlayfulButton = (event) => {
  const hero = document.querySelector(".hero");
  const heroRect = hero.getBoundingClientRect();
  const btnRect = timeBtn.getBoundingClientRect();

  const offset = 120;
  const targetX = event.clientX - heroRect.left;
  const targetY = event.clientY - heroRect.top;

  let newX = targetX + (Math.random() * offset - offset / 2) - btnRect.width / 2;
  let newY = targetY + (Math.random() * offset - offset / 2) - btnRect.height / 2;

  newX = clamp(newX, 0, heroRect.width - btnRect.width);
  newY = clamp(newY, 0, heroRect.height - btnRect.height);

  timeBtn.style.position = "absolute";
  timeBtn.style.left = `${newX}px`;
  timeBtn.style.top = `${newY}px`;
  timeBtn.style.transform = "translateZ(0)";
};

const handlePointerMove = (event) => {
  movePlayfulButton(event.touches ? event.touches[0] : event);
};

let playfulCooldown = false;
let playfulAttempts = 0;
const scheduleMove = (event) => {
  if (playfulCooldown) return;
  playfulCooldown = true;
  handlePointerMove(event);
  playfulAttempts += 1;
  setTimeout(() => {
    playfulCooldown = false;
  }, 250);
};

timeBtn.addEventListener("mousemove", scheduleMove);
timeBtn.addEventListener("touchstart", scheduleMove, { passive: true });
timeBtn.addEventListener("click", () => {
  if (playfulAttempts >= 4) {
    loveResult.textContent = "Ou fou? Si w fou asireman ou fou pou mwen. Depoze boutey la, epi vini pou m pran w nan bra m.";
    loveResult.classList.add("visible");
    playfulAttempts = 0;
  }
  sendClickConfirmation("Je veux prendre plus de temps");
});

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.textContent = "Couper la musique";
    musicToggle.setAttribute("aria-pressed", "true");
  } else {
    bgMusic.pause();
    musicToggle.textContent = "Activer une musique douce";
    musicToggle.setAttribute("aria-pressed", "false");
  }
});

spawnFloatingHearts();
spawnSparkles();

const resizeCanvas = () => {
  const ratio = window.devicePixelRatio || 1;
  petalCanvas.width = Math.floor(window.innerWidth * ratio);
  petalCanvas.height = Math.floor(window.innerHeight * ratio);
  petalCanvas.style.width = "100%";
  petalCanvas.style.height = "100%";
};

const petalCtx = petalCanvas.getContext("2d");
const petalColors = [
  "rgba(255, 182, 193, 0.7)",
  "rgba(255, 199, 221, 0.6)",
  "rgba(255, 214, 230, 0.55)",
  "rgba(255, 205, 215, 0.65)"
];

const petals = Array.from({ length: 28 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  size: 12 + Math.random() * 18,
  speed: 0.4 + Math.random() * 1.4,
  sway: 20 + Math.random() * 30,
  phase: Math.random() * Math.PI * 2,
  rotation: Math.random() * Math.PI,
  rotationSpeed: 0.002 + Math.random() * 0.004,
  color: petalColors[Math.floor(Math.random() * petalColors.length)]
}));

const drawPetal = (petal) => {
  const ratio = window.devicePixelRatio || 1;
  const cx = petal.x * ratio;
  const cy = petal.y * ratio;

  petalCtx.save();
  petalCtx.translate(cx, cy);
  petalCtx.rotate(petal.rotation);
  petalCtx.scale(1, 0.7);

  petalCtx.beginPath();
  petalCtx.moveTo(0, -petal.size * 0.5);
  petalCtx.quadraticCurveTo(petal.size * 0.6, 0, 0, petal.size * 0.6);
  petalCtx.quadraticCurveTo(-petal.size * 0.6, 0, 0, -petal.size * 0.5);
  petalCtx.fillStyle = petal.color;
  petalCtx.shadowColor = "rgba(255, 180, 200, 0.35)";
  petalCtx.shadowBlur = 10;
  petalCtx.fill();
  petalCtx.restore();
};

const animatePetals = () => {
  if (!petalCtx) return;
  petalCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);

  petals.forEach((petal) => {
    petal.y += petal.speed;
    petal.x += Math.sin(petal.phase) * 0.6;
    petal.phase += 0.01 + petal.speed * 0.002;
    petal.rotation += petal.rotationSpeed;

    if (petal.y > window.innerHeight + 40) {
      petal.y = -40;
      petal.x = Math.random() * window.innerWidth;
    }

    drawPetal(petal);
  });

  requestAnimationFrame(animatePetals);
};

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
animatePetals();
