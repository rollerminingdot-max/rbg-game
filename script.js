const game = document.getElementById("game");
const player = document.getElementById("player");
const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

/* ================= اللاعب ================= */
let playerPos = { x: 300, y: 200 };
let moveDir = { x: 0, y: 0 };

/* ================= joystick ================= */
let dragging = false;
const center = { x: 60, y: 60 };

joystick.addEventListener("pointerdown", () => dragging = true);

document.addEventListener("pointerup", () => {
  dragging = false;
  moveDir.x = 0;
  moveDir.y = 0;
  stick.style.left = "35px";
  stick.style.top  = "35px";
});

document.addEventListener("pointermove", e => {
  if (!dragging) return;

  const r = joystick.getBoundingClientRect();
  const dx = e.clientX - r.left - center.x;
  const dy = e.clientY - r.top  - center.y;

  const dist = Math.min(Math.sqrt(dx*dx + dy*dy), 40);
  const ang  = Math.atan2(dy, dx);

  stick.style.left = center.x + Math.cos(ang)*dist - 25 + "px";
  stick.style.top  = center.y + Math.sin(ang)*dist - 25 + "px";

  moveDir.x = Math.cos(ang) * dist * 0.1;
  moveDir.y = Math.sin(ang) * dist * 0.1;
});

/* ================= الشفرات ================= */
const blades = [];
let baseAngle = 0;

for (let i = 0; i < 3; i++) {
  const b = document.createElement("div");
  b.className = "blade";
  game.appendChild(b);
  blades.push({ el: b, offset: i * (Math.PI * 2 / 3), x: 0, y: 0 });
}

/* ================= الأعداء ================= */
const enemies = [];

function spawnEnemy() {
  const e = document.createElement("div");
  e.className = "enemy";

  const hp = document.createElement("div");
  hp.className = "hp";
  e.appendChild(hp);

  e.x = Math.random() * (game.clientWidth - 48);
  e.y = Math.random() * (game.clientHeight - 48);

  e.hp = 100;
  e.bleed = 0;
  e.kx = 0;
  e.ky = 0;

  game.appendChild(e);
  enemies.push(e);
}

setInterval(spawnEnemy, 1200);

/* ================= تصادم دائري ================= */
function circleHit(x1,y1,r1,x2,y2,r2){
  const dx=x1-x2, dy=y1-y2;
  return dx*dx + dy*dy <= (r1+r2)*(r1+r2);
}

/* ================= حلقة اللعبة ================= */
function loop() {
  /* حركة اللاعب */
  playerPos.x += moveDir.x;
  playerPos.y += moveDir.y;

  playerPos.x = Math.max(0, Math.min(game.clientWidth - 40, playerPos.x));
  playerPos.y = Math.max(0, Math.min(game.clientHeight - 40, playerPos.y));

  player.style.left = playerPos.x + "px";
  player.style.top  = playerPos.y + "px";

  /* دوران الشفرات */
  baseAngle += 0.25;

  blades.forEach(b => {
    const a = baseAngle + b.offset;
    b.x = playerPos.x + 20 + Math.cos(a) * 55;
    b.y = playerPos.y + 20 + Math.sin(a) * 55;
    b.el.style.left = b.x + "px";
    b.el.style.top  = b.y + "px";
    b.el.style.transform = `rotate(${a}rad)`;
  });

  /* تحديث الأعداء */
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    /* نزيف */
    if (e.bleed > 0) {
      e.hp -= e.bleed;
      e.bleed *= 0.95;
    }

    if (e.hp <= 0) {
      e.remove();
      enemies.splice(i,1);
      continue;
    }

    /* حركة نحو اللاعب */
    const ex = e.x + 24;
    const ey = e.y + 24;
    const px = playerPos.x + 20;
    const py = playerPos.y + 20;

    const ang = Math.atan2(py - ey, px - ex);

    e.x += Math.cos(ang) * 1.2 + e.kx;
    e.y += Math.sin(ang) * 1.2 + e.ky;

    e.kx *= 0.85;
    e.ky *= 0.85;

    e.style.left = e.x + "px";
    e.style.top  = e.y + "px";
    e.querySelector(".hp").style.width = (e.hp / 100 * 48) + "px";

    /* تصادم مع الشفرات */
    for (const b of blades) {
      if (circleHit(b.x+13, b.y+3, 18, ex, ey, 22)) {
        e.hp -= 10;
        e.bleed += 0.8;

        const ka = Math.atan2(ey-(b.y+3), ex-(b.x+13));
        e.kx += Math.cos(ka) * 4;
        e.ky += Math.sin(ka) * 4;
        break;
      }
    }
  }

  requestAnimationFrame(loop);
}

loop();
