const tg = window.Telegram.WebApp;
tg.expand();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;

let snake = [{x: 9 * box, y: 10 * box}];
let food = {
  x: Math.floor(Math.random() * 19) * box,
  y: Math.floor(Math.random() * 19) * box
};
let dir = "RIGHT";

document.addEventListener("keydown", direction);

function direction(event) {
  if (event.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
  else if (event.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
  else if (event.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
  else if (event.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 400, 400);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#00ff99" : "#00cc77";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (dir === "LEFT") headX -= box;
  if (dir === "RIGHT") headX += box;
  if (dir === "UP") headY -= box;
  if (dir === "DOWN") headY += box;

  if (
    headX < 0 || headX >= 400 || headY < 0 || headY >= 400 ||
    snake.slice(1).some(segment => segment.x === headX && segment.y === headY)
  ) {
    clearInterval(game);
    document.getElementById("score").textContent = `😵 Игра окончена. Очки: ${score}`;
    updateLeaderboard(score);
    return;
  }

  let newHead = {x: headX, y: headY};
  if (headX === food.x && headY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    };
  } else {
    snake.pop();
  }
  snake.unshift(newHead);

  document.getElementById("score").textContent = `Очки: ${score}`;
}

function updateLeaderboard(currentScore) {
  let username = tg.initDataUnsafe?.user?.username || "anon";
  let topScore = localStorage.getItem("topScore") || 0;
  if (currentScore > topScore) {
    localStorage.setItem("topScore", currentScore);
    localStorage.setItem("topUser", username);
  }
  let topUser = localStorage.getItem("topUser") || "—";
  let displayScore = localStorage.getItem("topScore") || "0";
  document.getElementById("leaderboard").textContent = `🏆 Лидер: ${topUser} — ${displayScore}`;
}

updateLeaderboard(score);
const game = setInterval(draw, 100);
