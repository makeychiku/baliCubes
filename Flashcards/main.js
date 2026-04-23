class FlashcardsApp {
  constructor() {
    this.deck = JSON.parse(localStorage.getItem("flashcards-deck")) || [];

    setInterval(() => {
      localStorage.setItem("flashcards-deck", JSON.stringify(this.deck));
    }, 5000);
  }

  addCard = (front, back) => {
    this.deck.push({ id: Date.now(), front, back, isLearned: false });
  };

  deleteCard = (id) => {
    this.deck = this.deck.filter((card) => card.id !== id);
  };

  updateCard = (id, front, back) => {
    const card = this.deck.find((c) => c.id === id);
    if (card) {
      card.front = front;
      card.back = back;
    }
  };

  toggleLearned = (id, status) => {
    const card = this.deck.find((c) => c.id === id);
    if (card) card.isLearned = status;
  };

  shuffleDeck = () => {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  };
}
