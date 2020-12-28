let playingfieldElem = document.querySelector(".playingfield");
const scoreElem = document.getElementById("score");
const levelElem = document.getElementById("level");
const nextFigureElem = document.getElementById("next-figure");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const gameOverElem = document.getElementById("game-over");


let playfield = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let levels = {
  1: {
    scorePerLine: 100,
    speed: 500,
    nextLevelScore: 300,
  },
  2: {
    scorePerLine: 150,
    speed: 350,
    nextLevelScore: 1500,
  },
  3: {
    scorePerLine: 250,
    speed: 250,
    nextLevelScore: 2500,
  },
  4: {
    scorePerLine: 300,
    speed: 150,
    nextLevelScore: 3500,
  },
  5: {
    scorePerLine: 500,
    speed: 100,
    nextLevelScore: 5000,
  },
  6: {
    scorePerLine: 1000,
    speed: 50,
    nextLevelScore: Infinity,
  },
};

let figures = {
  O: [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  S: [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
  ],
  Z: [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
  ],
  L: [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
  ],
  J: [
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
  ],
  T: [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
  ],
};

let score = 0;
let nextStepTimer;
let currentLevel = 1;
let isPaused = true;
let activeFigure = spawnNewFigure();
let nextFigure = activeFigure;
drawNextFigure();
draw();
nextFigure = spawnNewFigure();

function draw() {
  let playingfieldHTML = "";
  for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) {
      if (playfield[y][x] === 1) {
        playingfieldHTML += '<div class="cell movingCell"></div>';
      } else if (playfield[y][x] === 2) {
        playingfieldHTML += '<div class="cell fixedCell"></div>';
      } else {
        playingfieldHTML += '<div class="cell"></div>';
      }
    }
  }
  playingfieldElem.innerHTML = playingfieldHTML;
}

function drawNextFigure() {
  let nextFigureHTML = "";
  for (let y = 0; y < nextFigure.shape.length; y++) {
    for (let x = 0; x < nextFigure.shape[y].length; x++) {
      if (nextFigure.shape[y][x]) {
        nextFigureHTML += '<div class="cell movingCell"></div>';
      } else {
        nextFigureHTML += '<div class="cell"></div>';
      }
    }
  }
  nextFigureElem.innerHTML = nextFigureHTML;
}

function addActiveFigure() {//рисуем текущую фигуру на игровом поле
  removePrevActiveFigure();
  for (let y = 0; y < activeFigure.shape.length; y++) {
    for (let x = 0; x < activeFigure.shape[y].length; x++) {
      if (activeFigure.shape[y][x] === 1) {
        playfield[activeFigure.y + y][activeFigure.x + x] =
          activeFigure.shape[y][x];
      }
    }
  }
}

function removePrevActiveFigure() {//чистим поле от активной фигуры и оставляем зафиксированные
  for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) {
      if (playfield[y][x] === 1) {
        playfield[y][x] = 0;
      }
    }
  }
}

function rotateFigure() {//переворачивание фигуры
  const prevFigureState = activeFigure.shape;

  activeFigure.shape = activeFigure.shape[0].map((val, index) =>
    activeFigure.shape.map((row) => row[index]).reverse()
  );

  if (hasCollisions()) {
    activeFigure.shape = prevFigureState;
  }
}

function hasCollisions() {//проверка на коллизию(выход за границы массива, столкновение с зафиксированной фигурой)
  for (let y = 0; y < activeFigure.shape.length; y++) {
    for (let x = 0; x < activeFigure.shape[y].length; x++) {
      if (activeFigure.shape[y][x] && (playfield[activeFigure.y + y] === undefined ||
            playfield[activeFigure.y + y][activeFigure.x + x] === undefined ||
            playfield[activeFigure.y + y][activeFigure.x + x] === 2)
      ) {
        return true;
      }
    }
  }
  return false;
}

function removeFullLines() {//удаление строк, начисление очков, отображение уровня
  let canRemoveLine = true;
  let filledLines = 0;
  for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) {
      if (playfield[y][x] !== 2) {//проверка заполнения всех строк
        canRemoveLine = false;
        break;
      }
    }
    if (canRemoveLine) {
      playfield.splice(y, 1);
      playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      filledLines += 1;
    }
    canRemoveLine = true;
  }

  switch (filledLines) {
    case 1:
      score += levels[currentLevel].scorePerLine;
      break;
    case 2:
      score += levels[currentLevel].scorePerLine * 3;
      break;
    case 3:
      score += levels[currentLevel].scorePerLine * 6;
      break;
    case 4:
      score += levels[currentLevel].scorePerLine * 12;
      break;
  }

  scoreElem.innerHTML = score;

  if (score >= levels[currentLevel].nextLevelScore) {
    currentLevel++;
    levelElem.innerHTML = currentLevel;
  }
}

function spawnNewFigure() {
  const possibleFigures = "IOLJTSZ";
  const rand = Math.floor(Math.random() * 7);
  const newFigure = figures[possibleFigures[rand]];

  return {
    x: Math.floor((10 - newFigure[0].length) / 2),
    y: 0,
    shape: newFigure,
  };
}

function fixFigure() {
  for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) {
      if (playfield[y][x] === 1) {
        playfield[y][x] = 2;
      }
    }
  }
}

function moveFigureDown() {
  activeFigure.y += 1;
  if (hasCollisions()) {
    activeFigure.y -= 1;
    fixFigure();
    removeFullLines();
    activeFigure = nextFigure;
    if (hasCollisions()) {
      gameOver();
    }else{
      nextFigure = spawnNewFigure();
    }
  }
}

function dropFigure() {
  for (let y = activeFigure.y; y < playfield.length; y++) {
    activeFigure.y += 1;
    if (hasCollisions()) {
      activeFigure.y -= 1;
      break;
    }
  }
}

function gameOver() {
  isPaused = true;
  clearTimeout(nextStepTimer);
  gameOverElem.style.display = "block";
}

document.onkeydown = function (e) {
  if (!isPaused) {
    if (e.code == "KeyA") {
      activeFigure.x -= 1;
      if (hasCollisions()) {
        activeFigure.x += 1;
      }
    } else if (e.code == "KeyD") {
      activeFigure.x += 1;
      if (hasCollisions()) {
        activeFigure.x -= 1;
      }
    } else if (e.code == "KeyS") {
      moveFigureDown();
    } else if (e.code == "KeyE") {
      rotateFigure();
    } else if (e.code == "KeyQ") {
      dropFigure();
    }

    updateGameState();
  }
};

function updateGameState() {
  if (!isPaused) {
    addActiveFigure();
    drawNextFigure();
    draw();
  }
}

pauseBtn.addEventListener("click", (e) => {
  if (!isPaused) {
    e.target.innerHTML = "Resume";
    clearTimeout(nextStepTimer);
  } else {
    e.target.innerHTML = "Pause";
    nextStepTimer = setTimeout(startGame, levels[currentLevel].speed);
  }
  isPaused = !isPaused;
});

startBtn.addEventListener("click", (e) => {
  if(e.target.innerHTML == "Stop"){
    location.reload();
  }
  e.target.innerHTML = "Stop";
  isPaused = false;
  nextStepTimer = setTimeout(startGame, levels[1].speed);
  gameOverElem.style.display = "none";
});

scoreElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

draw();

function startGame() {//цикл
  moveFigureDown();
  if (!isPaused) {
    updateGameState();
    nextStepTimer = setTimeout(startGame, levels[currentLevel].speed);
  }
}
