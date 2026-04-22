class HTMLRenderer {
  constructor() {
    this.game = null;

    this.setupScreen = document.querySelector("#setup-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.winScreen = document.querySelector("#win-screen");

    this.numPlayersInput = document.querySelector("#num-players");
    this.startBtn = document.querySelector("#start-btn");
    this.restartBtn = document.querySelector("#restart-btn");

    this.rollBtn = document.querySelector("#roll-btn");
    this.diceDisplay = document.querySelector("#dice-display");
    this.actionsDisplay = document.querySelector("#actions-display");

    this.turnIndicator = document.querySelector("#turn-indicator");
    this.boardsArea = document.querySelector("#boards-area");
    this.winnerText = document.querySelector("#winner-text");

    this.initListeners();
  }

  initListeners = () => {
    this.startBtn.addEventListener("click", () => {
      const numPlayers = Number(this.numPlayersInput.value);
      if (numPlayers < 2) return alert("Need at least 2 players!");
      if (numPlayers > 6) return alert("Maximum 6 Players!");

      this.game = new Game(numPlayers);

      this.setupScreen.style.display = "none";
      this.gameScreen.style.display = "flex";
      this.updateUI();
    });

    this.restartBtn.addEventListener("click", () => {
      this.winScreen.style.display = "none";
      this.setupScreen.style.display = "flex";
    });

    this.rollBtn.addEventListener("click", () => {
      const dice = this.game.rollDice();
      this.renderDice(dice);

      this.rollBtn.disabled = true;

      const moves = this.game.getAvailableMoves();
      this.renderActions(moves);
    });
  };

  updateUI = () => {
    const currentPlayerId = this.game.players[this.game.currentPlayerIndex].id;
    this.turnIndicator.innerText = `Player ${currentPlayerId}'s Turn`;

    this.diceDisplay.innerHTML = "";
    this.actionsDisplay.innerHTML = "";
    this.rollBtn.disabled = false;

    this.renderBoards();
  };

  renderDice = ([d1, d2]) => {
    this.diceDisplay.innerHTML = `
            <div> | ${d1} | </div>
            <div> | ${d2} | </div>
        `;
  };

  renderActions = (moves) => {
    this.actionsDisplay.innerHTML = "";

    if (moves.length === 0) {
      const skipBtn = document.createElement("button");
      skipBtn.className = "btn-warning move-btn";
      skipBtn.innerText = "No available moves (Skip)";

      skipBtn.addEventListener("click", () => {
        this.game.nextTurn();
        this.updateUI();
      });

      this.actionsDisplay.appendChild(skipBtn);
      return;
    }

    moves.forEach((move) => {
      const btn = document.createElement("button");
      btn.className = "btn-success move-btn";
      btn.innerText = move.text;

      btn.addEventListener("click", () => {
        const isGameOver = this.game.makeMove(move.values);

        if (isGameOver) {
          this.showWinScreen();
        } else {
          this.updateUI();
        }
      });

      this.actionsDisplay.appendChild(btn);
    });
  };

  renderBoards = () => {
    let allBoardsHtml = "";

    this.game.players.forEach((player, index) => {
      const isActive = index === this.game.currentPlayerIndex ? "active" : "";

      let numbersHtml = "";
      for (let i = 1; i <= 12; i++) {
        const isRemoved = !player.numbers.includes(i) ? "removed" : "";
        numbersHtml += `<div class="number-box ${isRemoved}">${i}</div>`;
      }

      allBoardsHtml += `
      <div class="player-board ${isActive}">
        <h3 style="margin: 0;">Player ${player.id}</h3>
        <div class="numbers-row">
          ${numbersHtml}
        </div>
      </div>
    `;
    });

    this.boardsArea.innerHTML = allBoardsHtml;
  };

  showWinScreen = () => {
    this.gameScreen.style.display = "none";
    this.winScreen.style.display = "flex";
    this.winnerText.innerText = `Player ${this.game.winner.id} wins!`;
  };
}

const app = new HTMLRenderer();
