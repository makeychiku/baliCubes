class HTMLRenderer {
  constructor(app) {
    this.app = app;

    this.frontInput = document.querySelector("#input-front");
    this.backInput = document.querySelector("#input-back");
    this.addBtn = document.querySelector("#add-btn");
    this.formTitle = document.querySelector("#form-title");
    this.cardsList = document.querySelector("#cards-list");

    this.studyCardEl = document.querySelector("#study-card");
    this.studyProgressEl = document.querySelector("#study-progress");
    this.learnedCheckbox = document.querySelector("#filter-learned");
    this.prevBtn = document.querySelector("#prev-btn");
    this.nextBtn = document.querySelector("#next-btn");
    this.flipBtn = document.querySelector("#flip-btn");
    this.shuffleBtn = document.querySelector("#shuffle-btn");

    this.studyIndex = 0;
    this.isFrontShowing = true;
    this.editingId = null;

    this.initListeners();
  }

  initListeners = () => {
    this.addBtn.addEventListener("click", () => {
      const front = this.frontInput.value.trim();
      const back = this.backInput.value.trim();

      if (!front || !back) {
        alert("Fill in both fields!");
        return;
      }

      if (this.editingId) {
        this.app.updateCard(this.editingId, front, back);
        this.editingId = null;
        this.addBtn.innerText = "Add";
        this.formTitle.innerText = "Add Card";
      } else {
        this.app.addCard(front, back);
      }

      this.frontInput.value = "";
      this.backInput.value = "";
      this.updateUI();
    });

    this.cardsList.addEventListener("click", (event) => {
      const target = event.target;
      if (!target.dataset.id) return;

      const id = Number(target.dataset.id);

      if (target.classList.contains("delete-btn")) {
        this.app.deleteCard(id);
        this.updateUI();
      }

      if (target.classList.contains("edit-btn")) {
        const card = this.app.deck.find((c) => c.id === id);
        this.frontInput.value = card.front;
        this.backInput.value = card.back;
        this.editingId = id;
        this.addBtn.innerText = "Save Changes";
        this.formTitle.innerText = "Edit Card";
      }
    });

    this.cardsList.addEventListener("change", (event) => {
      if (event.target.classList.contains("learned-checkbox")) {
        const id = Number(event.target.dataset.id);
        this.app.toggleLearned(id, event.target.checked);
        this.updateUI();
      }
    });

    this.flipBtn.addEventListener("click", () => {
      this.isFrontShowing = !this.isFrontShowing;
      this.renderStudyForm();
    });

    this.nextBtn.addEventListener("click", () => {
      this.studyIndex++;
      this.isFrontShowing = true;
      this.renderStudyForm();
    });

    this.prevBtn.addEventListener("click", () => {
      this.studyIndex--;
      this.isFrontShowing = true;
      this.renderStudyForm();
    });

    this.shuffleBtn.addEventListener("click", () => {
      this.app.shuffleDeck();
      this.studyIndex = 0;
      this.isFrontShowing = true;
      this.updateUI();
    });

    this.learnedCheckbox.addEventListener("change", () => {
      this.studyIndex = 0;
      this.isFrontShowing = true;
      this.updateUI();
    });
  };

  updateUI = () => {
    this.renderList();
    this.renderStudyForm();
  };

  renderList = () => {
    this.cardsList.innerHTML = this.app.deck.reduce((html, card) => {
      const learnedClass = card.isLearned ? "learned" : "";
      const checkedAttribute = card.isLearned ? "checked" : "";

      return (
        html +
        `
        <div class="list-item ${learnedClass}">
          <div>
            <strong>Q:</strong> ${card.front} <br>
            <strong style="color: #666;">A:</strong> ${card.back}
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <label>
              <input type="checkbox" class="learned-checkbox" data-id="${card.id}" ${checkedAttribute}> Learned
            </label>
            <button class="btn-warning edit-btn" data-id="${card.id}">Edit</button>
            <button class="btn-danger delete-btn" data-id="${card.id}">Delete</button>
          </div>
        </div>
      `
      );
    }, "");
  };

  renderStudyForm = () => {
    let studyCards = this.app.deck;
    if (this.learnedCheckbox.checked) {
      studyCards = this.app.deck.filter((card) => !card.isLearned);
    }

    if (studyCards.length === 0) {
      this.studyCardEl.innerText = "Deck is empty or no cards to study";
      this.studyCardEl.style.backgroundColor = "#eef2f5";
      this.studyProgressEl.innerText = "";
      this.prevBtn.disabled = true;
      this.nextBtn.disabled = true;
      this.flipBtn.disabled = true;
      return;
    }

    if (this.studyIndex >= studyCards.length)
      this.studyIndex = studyCards.length - 1;
    if (this.studyIndex < 0) this.studyIndex = 0;

    const currentCard = studyCards[this.studyIndex];

    this.studyCardEl.innerText = this.isFrontShowing
      ? currentCard.front
      : currentCard.back;
    this.studyCardEl.style.backgroundColor = this.isFrontShowing
      ? "#eef2f5"
      : "#fff3cd";

    this.studyProgressEl.innerText = `Card ${this.studyIndex + 1} of ${studyCards.length}`;

    this.prevBtn.disabled = this.studyIndex === 0;
    this.nextBtn.disabled = this.studyIndex === studyCards.length - 1;
    this.flipBtn.disabled = false;
  };
}

const app = new FlashcardsApp();
const renderer = new HTMLRenderer(app);
renderer.updateUI();
