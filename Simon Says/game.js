class SimonGame {
  constructor() {
    this.highScore = Number(localStorage.getItem("simon-high-score")) || 0;
    this.sequence = [];
    this.playerStep = 0;
    this.level = 1;
  }

  resetGame = () => {
    this.sequence = [];
    this.playerStep = 0;
    this.level = 1;
  };

  addNextStep = () => {
    const nextColor = Math.floor(Math.random() * 4);
    this.sequence.push(nextColor);
  };

  checkPlayerMove = (clickedColorId) => {
    const expectedColorId = this.sequence[this.playerStep];

    if (clickedColorId !== expectedColorId) {
      return "game-over";
    }

    this.playerStep++;

    if (this.playerStep === this.sequence.length) {
      this.level++;
      this.playerStep = 0;

      if (this.level - 1 > this.highScore) {
        this.highScore = this.level - 1;
        localStorage.setItem("simon-high-score", this.highScore);
      }

      return "round-won";
    }

    return "continue";
  };
}
