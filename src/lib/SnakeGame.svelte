<script>
  import { createEventDispatcher, tick, onDestroy } from "svelte";
  const dispatch = createEventDispatcher();

  export let active = false;

  const TARGET_COLS = 60;

  // --- Web Audio API sound effects ---
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playTone(freq, duration, type = "square", volume = 0.15) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  function sfxEat() {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  }

  function sfxDie() {
    const ctx = getAudioCtx();
    [200, 150, 100].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.15);
    });
  }

  function sfxStart() {
    const ctx = getAudioCtx();
    [330, 440, 550, 660].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.1);
    });
  }

  function sfxTurn() {
    playTone(440, 0.04, "square", 0.06);
  }

  let gameActive = false;
  let gameOver = false;
  let canvas;
  let ctx;
  let vpWidth = 0;
  let vpHeight = 0;

  let snake = [];
  let direction = { col: 1, row: 0 };
  let nextDirection = { col: 1, row: 0 };
  let food = { col: 0, row: 0 };
  let score = 0;
  let gameInterval = null;
  let obstacles = new Set();
  let windowRects = [];

  $: CELL = Math.max(12, Math.floor(vpWidth / TARGET_COLS));
  $: cols = Math.floor(vpWidth / CELL);
  $: rows = Math.floor(vpHeight / CELL);
  $: canvasWidth = cols * CELL;
  $: canvasHeight = rows * CELL;

  function scanWindowObstacles() {
    obstacles.clear();
    windowRects = [];

    const selectors =
      ".vscode, #OverviewWindow, [id^='fileSysWindow'], #JSremBoxMobile";
    const windowElements = document.querySelectorAll(selectors);

    windowElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const startCol = Math.max(0, Math.floor(rect.left / CELL));
      const startRow = Math.max(0, Math.floor(rect.top / CELL));
      const endCol = Math.min(cols, Math.ceil(rect.right / CELL));
      const endRow = Math.min(rows, Math.ceil(rect.bottom / CELL));

      windowRects.push({ startCol, startRow, endCol, endRow });

      for (let c = startCol; c < endCol; c++) {
        for (let r = startRow; r < endRow; r++) {
          obstacles.add(`${c},${r}`);
        }
      }
    });

    // Mark top bar and bottom bar as obstacles
    const topBarRows = Math.ceil(28 / CELL);
    const bottomBarStartRow = Math.floor((vpHeight - 37) / CELL);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < topBarRows; r++) {
        obstacles.add(`${c},${r}`);
      }
      for (let r = bottomBarStartRow; r < rows; r++) {
        obstacles.add(`${c},${r}`);
      }
    }

    // Add top and bottom bars to windowRects for green borders
    windowRects.push({ startCol: 0, startRow: 0, endCol: cols, endRow: topBarRows });
    windowRects.push({ startCol: 0, startRow: bottomBarStartRow, endCol: cols, endRow: rows });
  }

  function findClearPosition() {
    const midRow = Math.floor(rows / 2);
    for (let r = midRow; r < rows - 2; r++) {
      for (let c = 5; c < cols - 5; c++) {
        let clear = true;
        for (let i = -2; i <= 2; i++) {
          if (obstacles.has(`${c + i},${r}`)) {
            clear = false;
            break;
          }
        }
        if (clear) return { col: c, row: r };
      }
    }
    for (let r = 2; r < rows - 2; r++) {
      for (let c = 2; c < cols - 2; c++) {
        if (!obstacles.has(`${c},${r}`)) return { col: c, row: r };
      }
    }
    return { col: Math.floor(cols / 2), row: Math.floor(rows / 2) };
  }

  function placeFood() {
    let attempts = 0;
    do {
      food = {
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
      };
      attempts++;
    } while (
      (obstacles.has(`${food.col},${food.row}`) ||
        snake.some((s) => s.col === food.col && s.row === food.row)) &&
      attempts < 1000
    );
  }

  function startGame() {
    gameActive = true;
    gameOver = false;
    score = 0;
    direction = { col: 1, row: 0 };
    nextDirection = { col: 1, row: 0 };

    tick().then(() => {
      ctx = canvas.getContext("2d");
      scanWindowObstacles();

      const startPos = findClearPosition();
      snake = [
        startPos,
        { col: startPos.col - 1, row: startPos.row },
        { col: startPos.col - 2, row: startPos.row },
      ];

      placeFood();
      sfxStart();
      gameInterval = setInterval(gameTick, 150);
      draw();
    });
  }

  function gameTick() {
    direction = { ...nextDirection };
    const head = snake[0];
    const newHead = {
      col: head.col + direction.col,
      row: head.row + direction.row,
    };

    // Wall collision
    if (
      newHead.col < 0 ||
      newHead.col >= cols ||
      newHead.row < 0 ||
      newHead.row >= rows
    ) {
      handleGameOver();
      return;
    }
    // Self collision
    if (snake.some((s) => s.col === newHead.col && s.row === newHead.row)) {
      handleGameOver();
      return;
    }
    // Obstacle collision
    if (obstacles.has(`${newHead.col},${newHead.row}`)) {
      handleGameOver();
      return;
    }

    snake = [newHead, ...snake];

    if (newHead.col === food.col && newHead.row === food.row) {
      score += 10;
      sfxEat();
      placeFood();
    } else {
      snake = snake.slice(0, -1);
    }

    draw();
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Subtle grid lines
    ctx.strokeStyle = "rgba(0, 200, 0, 0.05)";
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, canvasHeight);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(canvasWidth, r * CELL);
      ctx.stroke();
    }

    // Obstacle cells (subtle red tint)
    ctx.fillStyle = "rgba(255, 0, 0, 0.08)";
    obstacles.forEach((key) => {
      const [c, r] = key.split(",").map(Number);
      ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
    });

    // Green border around each window obstacle region
    ctx.strokeStyle = "rgba(0, 255, 0, 0.4)";
    ctx.lineWidth = 2;
    windowRects.forEach((wr) => {
      const x = wr.startCol * CELL + 1;
      const y = wr.startRow * CELL + 1;
      const w = (wr.endCol - wr.startCol) * CELL - 2;
      const h = (wr.endRow - wr.startRow) * CELL - 2;
      ctx.strokeRect(x, y, w, h);
    });

    // Food
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(
      food.col * CELL + 2,
      food.row * CELL + 2,
      CELL - 4,
      CELL - 4
    );

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#00ff00" : "#00cc00";
      ctx.fillRect(
        seg.col * CELL + 1,
        seg.row * CELL + 1,
        CELL - 2,
        CELL - 2
      );
    });

    // Border around playfield
    ctx.strokeStyle = "rgba(0, 255, 0, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvasWidth - 2, canvasHeight - 2);
  }

  function handleGameOver() {
    clearInterval(gameInterval);
    gameInterval = null;
    gameOver = true;
    sfxDie();

    // Flash snake red
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    snake.forEach((seg) => {
      ctx.fillRect(seg.col * CELL, seg.row * CELL, CELL, CELL);
    });

    // Game over card
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    const cardW = 320;
    const cardH = 120;
    const cardX = cx - cardW / 2;
    const cardY = cy - cardH / 2;

    // Card background
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Border — double-stroke neon green
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(cardX - 4, cardY - 4, cardW + 8, cardH + 8);

    // Scanline effect inside card
    ctx.fillStyle = "rgba(0, 255, 0, 0.03)";
    for (let y = cardY; y < cardY + cardH; y += 3) {
      ctx.fillRect(cardX, y, cardW, 1);
    }

    // Text
    ctx.fillStyle = "#00ff00";
    ctx.textAlign = "center";
    ctx.font = "bold 22px monospace";
    ctx.fillText("GAME OVER", cx, cy - 18);
    ctx.font = "16px monospace";
    ctx.fillText(`Score: ${score}`, cx, cy + 8);
    ctx.fillStyle = "rgba(0, 255, 0, 0.6)";
    ctx.font = "13px monospace";
    ctx.fillText("ENTER or tap to restart  |  ESC or X to quit", cx, cy + 38);
  }

  function endGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = null;
    gameActive = false;
    gameOver = false;
    dispatch("close");
  }

  function handleKeydown(e) {
    if (!gameActive) return;

    if (gameOver) {
      if (e.key === "Enter") {
        e.preventDefault();
        startGame();
      } else if (e.key === "Escape") {
        e.preventDefault();
        endGame();
      }
      return;
    }

    const keyMap = {
      ArrowUp: { col: 0, row: -1 },
      ArrowDown: { col: 0, row: 1 },
      ArrowLeft: { col: -1, row: 0 },
      ArrowRight: { col: 1, row: 0 },
    };
    const newDir = keyMap[e.key];

    if (e.key === "Escape") {
      e.preventDefault();
      endGame();
      return;
    }

    if (!newDir) return;

    // Prevent reversing into self
    if (newDir.col !== -direction.col || newDir.row !== -direction.row) {
      if (newDir.col !== nextDirection.col || newDir.row !== nextDirection.row) {
        sfxTurn();
      }
      nextDirection = newDir;
    }
    e.preventDefault();
  }

  // --- Touch / swipe handling ---
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 20;

  function handleTouchStart(e) {
    if (!gameActive) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }

  function handleTouchEnd(e) {
    if (!gameActive) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    if (gameOver) {
      // Tap anywhere to restart
      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
        startGame();
      }
      return;
    }

    // Determine swipe direction based on larger axis
    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

    let newDir;
    if (Math.abs(dx) > Math.abs(dy)) {
      newDir = dx > 0 ? { col: 1, row: 0 } : { col: -1, row: 0 };
    } else {
      newDir = dy > 0 ? { col: 0, row: 1 } : { col: 0, row: -1 };
    }

    if (newDir.col !== -direction.col || newDir.row !== -direction.row) {
      if (newDir.col !== nextDirection.col || newDir.row !== nextDirection.row) {
        sfxTurn();
      }
      nextDirection = newDir;
    }
  }

  $: if (active && !gameActive) {
    startGame();
  }

  onDestroy(() => {
    if (gameInterval) clearInterval(gameInterval);
    if (audioCtx) audioCtx.close();
  });
</script>

<svelte:window
  on:keydown={handleKeydown}
  bind:innerWidth={vpWidth}
  bind:innerHeight={vpHeight}
/>

{#if gameActive}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="snake-overlay"
    on:touchstart|preventDefault={handleTouchStart}
    on:touchend|preventDefault={handleTouchEnd}
    on:touchmove|preventDefault
  >
    <canvas
      bind:this={canvas}
      width={canvasWidth}
      height={canvasHeight}
    />
  </div>
  <div class="snake-hud">
    <span class="snake-score">Score: {score}</span>
    <button class="snake-close" on:click={endGame}>&times;</button>
  </div>
{/if}

<style>
  .snake-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.15);
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }

  .snake-hud {
    position: fixed;
    top: 35px;
    right: 0;
    z-index: 10001;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: silver;
    border: 2px outset #fff;
    padding: 2px 4px;
    font-family: "Pixelated MS Sans Serif", Arial, sans-serif;
    font-size: 12px;
    width: fit-content;
  }

  .snake-score {
    color: #000;
    font-weight: bold;
  }

  .snake-close {
    all: unset;
    background: silver;
    border: 2px outset #fff;
    font-weight: bold;
    color: #cc0000;
    cursor: pointer;
    font-size: 16px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
  }

  .snake-close:active {
    border-style: inset;
  }
</style>
