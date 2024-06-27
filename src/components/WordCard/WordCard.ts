import SentenceValidator from "../SentenceValidator/SentenceValidator";
import GamePage from "../GamePage/GamePage";

class WordCard {
  element: HTMLElement;

  parent: HTMLElement;

  word: string;

  sentenceValidator: SentenceValidator;

  gamePage: GamePage;

  wasDragged = false;

  id: string;

  constructor(
    word: string,
    parent: HTMLElement,
    sentenceValidator: SentenceValidator,
    gamePage: GamePage,
  ) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.word = word;
    this.parent = parent;
    this.sentenceValidator = sentenceValidator;
    this.gamePage = gamePage;
    this.element = document.createElement("div");
    this.element.textContent = this.word;
    this.element.classList.add("word-card");

    this.element.addEventListener("click", () => this.handleClick());

    this.element.draggable = true;

    this.element.addEventListener("dragstart", this.handleDragStart.bind(this));
    this.element.addEventListener("dragend", this.handleDragEnd.bind(this));
  }

  handleDragStart(event: DragEvent) {
    this.wasDragged = true;
    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", this.id);
      this.gamePage.draggedElement = this.element;
    }

    this.element.style.opacity = "0.5";
  }

  handleDragEnd(event: DragEvent) {
    this.gamePage.update();
    if (event.dataTransfer) {
      event.dataTransfer.clearData();
    }
    this.element.style.opacity = "1";
  }

  handleClick() {
    const resultBlock = document.querySelector(".result-block");
    const sourceBlock = document.querySelector(".source-block");
    if (
      this.parent.className === "source-block" &&
      resultBlock instanceof HTMLElement
    ) {
      resultBlock.append(this.element);
      this.parent = resultBlock;
      this.sentenceValidator.addWord(this.word);
    } else if (sourceBlock instanceof HTMLElement) {
      sourceBlock.append(this.element);
      this.parent = sourceBlock;
      this.sentenceValidator.removeWord(this.word);
      this.element.style.backgroundColor = "";
    }

    this.gamePage.update();
  }

  updateVisualCues() {
    if (this.sentenceValidator.isCorrectPlacement(this.word)) {
      this.element.style.backgroundColor = "green";
    } else {
      this.element.style.backgroundColor = "red";
    }
  }

  moveToResultBlock() {
    const resultBlock = document.querySelector(".result-block");
    if (resultBlock instanceof HTMLElement) {
      resultBlock.append(this.element);
      this.parent = resultBlock;
      this.gamePage.update();
    }
  }

  render() {
    this.parent.append(this.element);
  }
}

export default WordCard;
