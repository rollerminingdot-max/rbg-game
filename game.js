const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 18,
  speed: 4
};

// Virtual joystick
let joystick = {
  active: false,
  startX: 0,
  startY: 0,
  dx: 0,
  dy: 0
};

let gameRunning = false;

// Touch controls
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
  joystick.dx = joystick.dy = 0;
});

// Update
function update() {
  if (!gameRunning) return;

  const len = Math.hypot(joystick.dx, joystick.dy);
  if (len > 10) {
    player.x += (joystick.dx / len) * player.speed;
    player.y += (joystick.dy / len) * player.speed;
  }

  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
}

// Loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start game
document.getElementById("startBtn").onclick = () => {
  document.getElementById("startScreen").style.display = "none";
  gameRunning = true;
  loop();
};
