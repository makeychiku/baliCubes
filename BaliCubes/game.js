class Game {
  constructor(numPlayers) {
    this.players = [];
    for (let i = 0; i < numPlayers; i++) {
      this.players.push({
        id: i + 1,
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      });
    }

    this.currentPlayerIndex = 0;
    this.currentDice = null;
    this.winner = null;
  }

  rollDice = () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    this.currentDice = [d1, d2];
    return this.currentDice;
  };

  getAvailableMoves = () => {
    if (!this.currentDice) return [];

    const [d1, d2] = this.currentDice;
    const sum = d1 + d2;
    const activeNumbers = this.players[this.currentPlayerIndex].numbers;

    let moves = [];

    if (activeNumbers.includes(d1) || activeNumbers.includes(d2)) {
      moves.push({
        type: "separate",
        values: [d1, d2],
        text: "Remove " + d1 + " and " + d2,
      });
    }

    if (activeNumbers.includes(sum)) {
      moves.push({
        type: "sum",
        values: [sum],
        text: "Remove " + sum,
      });
    }

    return moves;
  };

  makeMove = (valuesToRemove) => {
    let player = this.players[this.currentPlayerIndex];

    player.numbers = player.numbers.filter(
      (num) => !valuesToRemove.includes(num),
    );

    if (player.numbers.length === 0) {
      this.winner = player;
      return true;
    }

    this.nextTurn();
    return false;
  };

  nextTurn = () => {
    this.currentDice = null;
    this.currentPlayerIndex++;

    if (this.currentPlayerIndex >= this.players.length) {
      this.currentPlayerIndex = 0;
    }
  };
}
