const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ================= PLAYER =================
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 18,
  speed: 4
};

// ================= ENEMIES =================
const enemies = [];
const bullets = [];

function spawnEnemy() {
  const edge = Math.floor(Math.random() * 4);
  let x, y;

  if (edge === 0) { x = 0; y = Math.random() * canvas.height; }
  if (edge === 1) { x = canvas.width; y = Math.random() * canvas.height; }
  if (edge === 2) { x = Math.random() * canvas.width; y = 0; }
  if (edge === 3) { x = Math.random() * canvas.width; y = canvas.height; }

  enemies.push({
    x,
    y,
    radius: 16,
    speed: 1.5,
    hp: 3
  });
}

// ================= JOYSTICK =================
let joystick = {
  active: false,
  startX: 0,
  startY: 0,
  dx: 0,
  dy: 0
};

canvas.addEventListener("touchstart", e => {
  joystick.active = true;
  joystick.startX = e.touches[0].clientX;
  joystick.startY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", e => {
  if (!joystick.active) return;
  joystick.dx = e.touches[0].clientX - joystick.startX;
  joystick.dy = e.touches[0].clientY - joystick.startY;
});

canvas.addEventListener("touchend", () => {
  joystick.active = false;
  joystick.dx = joystick.dy =
