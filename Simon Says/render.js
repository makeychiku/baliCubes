class HTMLRenderer {
  constructor() {
    this.game = new SimonGame();

    this.board = document.querySelector("#game-board");
    this.buttons = document.querySelectorAll(".simon-btn");
    this.startBtn = document.querySelector("#start-btn");
    this.statusText = document.querySelector("#status-text");

    this.levelDisplay = document.querySelector("#current-level");
    this.highScoreDisplay = document.querySelector("#high-score");

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.frequencies = [261.63, 329.63, 392.0, 523.25];

    this.isBoardLocked = true;

    this.init();
  }

  init = () => {
    this.highScoreDisplay.innerText = this.game.highScore;
    this.startBtn.addEventListener("click", this.handleStart);
    this.board.addEventListener("click", this.handleSimonClick);
  };

  sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  playTone = (frequency, duration) => {
    if (this.audioCtx.state === "suspended") this.audioCtx.resume();

    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioCtx.currentTime + duration / 1000,
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + duration / 1000);
  };

  handleStart = async () => {
    this.game.resetGame();
    this.updateScoreBoard();
    this.startBtn.disabled = true;

    await this.startNextRound();
  };

  startNextRound = async () => {
    this.isBoardLocked = true;
    this.board.classList.add("locked");

    this.game.addNextStep();
    this.updateScoreBoard();

    this.statusText.innerText = "Ready...";
    this.statusText.style.color = "#fbc531";
    await this.sleep(800);

    this.statusText.innerText = "Set...";
    await this.sleep(800);

    this.statusText.innerText = "GO!";
    this.statusText.style.color = "#4cd137";
    await this.sleep(600);

    this.statusText.innerText = "Watch and listen...";
    this.statusText.style.color = "#dcdde1";
    await this.sleep(400);

    await this.playSequence();

    this.statusText.innerText = "Your turn!";
    this.statusText.style.color = "#00a8ff";
    this.isBoardLocked = false;
    this.board.classList.remove("locked");
  };

  playSequence = async () => {
    for (let i = 0; i < this.game.sequence.length; i++) {
      const colorId = this.game.sequence[i];
      await this.flashButton(colorId);
      await this.sleep(300);
    }
  };

  flashButton = async (id) => {
    const btn = document.querySelector(`.simon-btn[data-id="${id}"]`);

    btn.classList.add("active");
    this.playTone(this.frequencies[id], 400);

    await this.sleep(400);

    btn.classList.remove("active");
  };

  handleSimonClick = async (event) => {
    if (this.isBoardLocked || !event.target.classList.contains("simon-btn"))
      return;

    const clickedId = Number(event.target.dataset.id);

    this.flashButton(clickedId);

    const moveResult = this.game.checkPlayerMove(clickedId);

    if (moveResult === "game-over") {
      this.gameOver();
    } else if (moveResult === "round-won") {
      this.isBoardLocked = true;
      this.board.classList.add("locked");
      this.statusText.innerText = "Correct! Get ready...";
      this.statusText.style.color = "#4cd137";

      await this.sleep(1500);
      await this.startNextRound();
    }
  };

  gameOver = () => {
    this.isBoardLocked = true;
    this.board.classList.add("locked");
    this.startBtn.disabled = false;

    this.playTone(150, 800);

    this.statusText.innerHTML = `GAME OVER! <br><span style="font-size: 16px;">You reached Level ${this.game.level}</span>`;
    this.statusText.style.color = "#e84118";

    this.highScoreDisplay.innerText = this.game.highScore;
  };

  updateScoreBoard = () => {
    this.levelDisplay.innerText = this.game.level;
  };
}

const app = new HTMLRenderer();
