import "./styles.css";
import Button from "../Button/Button";
import shuffleArray from "../utils/shuffleArray";
import data from "../../data/wordCollectionLevel1/wordCollectionLevel1.json";
import WordCard from "../WordCard/WordCard";
import SentenceValidator from "../SentenceValidator/SentenceValidator";

class GamePage {
  container: HTMLElement;

  sentence: string[];

  rounds: any[];

  wordCards: WordCard[];

  currentRoundIndex: number;

  currentSentenceIndex: number;

  sentenceValidator: SentenceValidator;

  checkButton: Button;

  autoCompleteButton: Button = new Button("Auto-Complete", () => {});

  draggedElement: HTMLElement | null = null;

  sourceBlock: HTMLElement;

  resultBlock: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.rounds = data.rounds;
    this.currentRoundIndex = 0;
    this.currentSentenceIndex = 0;
    this.sentence = this.getSentence();
    this.sentenceValidator = new SentenceValidator(this.sentence);
    this.wordCards = [];

    this.sourceBlock = document.createElement("div");
    this.sourceBlock.className = "source-block";

    this.resultBlock = document.createElement("div");
    this.resultBlock.className = "result-block";

    this.checkButton = new Button("Check", () => {
      if (this.sentenceValidator.isCorrect()) {
        this.sentence = this.getSentence();
        this.sentenceValidator = new SentenceValidator(this.sentence);
        this.render();
        this.update();
      } else {
        this.updateVisualCues();
      }
    });
    this.checkButton.setDisabled(true);

    this.autoCompleteButton = new Button("Auto-Complete", () => {
      this.autoComplete();
    });
    this.autoCompleteButton.element.classList.add("button-autocomplete");

    [this.sourceBlock, this.resultBlock].forEach((block) => {
      block.addEventListener("dragover", this.handleDragOver.bind(this));
      block.addEventListener("drop", this.handleDrop.bind(this));
      block.addEventListener("dragenter", this.handleDragEnter.bind(this));
    });

    this.render();
    this.update();
  }

  // eslint-disable-next-line class-methods-use-this
  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // eslint-disable-next-line class-methods-use-this
  handleDragEnter(event: DragEvent) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (
      target.className === "source-block" ||
      target.className === "result-block"
    ) {
      target.style.backgroundColor = "lightgray";
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    (event.target as HTMLElement).style.backgroundColor = "";
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const dropTarget = event.target as HTMLElement | null;
    if (!dropTarget) {
      return;
    }
    if (
      dropTarget.className !== "source-block" &&
      dropTarget.className !== "result-block" &&
      dropTarget.className !== "word-card"
    ) {
      return;
    }
    if (event.dataTransfer !== null) {
      const id = event.dataTransfer.getData("text/plain");
      const wordCard = this.wordCards.find((card) => card.id === id);

      if (wordCard && wordCard.element && wordCard.element.parentNode) {
        if (wordCard.element !== dropTarget) {
          wordCard.element.parentNode.removeChild(wordCard.element);
        }

        if (dropTarget.className === "word-card") {
          if (dropTarget.parentNode) {
            dropTarget.parentNode.insertBefore(wordCard.element, dropTarget);
          }
        } else if (dropTarget.className === "result-block") {
          dropTarget.appendChild(wordCard.element);
        } else if (dropTarget.className === "source-block") {
          dropTarget.appendChild(wordCard.element);
        }

        wordCard.parent = dropTarget;
      }
      this.update();
    }
    if (dropTarget) {
      dropTarget.style.backgroundColor = "";
    }
  }

  nextRound() {
    this.currentRoundIndex += 1;
    this.sentence = this.getSentence();
    this.render();
    this.update();
  }

  getSentence() {
    const round = this.rounds[this.currentRoundIndex];
    const randomIndex = Math.floor(Math.random() * round.words.length);
    const sentence = round.words[randomIndex].textExample.split(" ");

    round.words.splice(randomIndex, 1);

    if (round.words.length === 0) {
      this.currentRoundIndex += 1;
      if (this.currentRoundIndex >= this.rounds.length) {
        this.currentRoundIndex = 0;
      }
    }

    return sentence;
  }

  autoComplete() {
    const resultBlock = document.querySelector(".result-block");
    const sourceBlock = document.querySelector(".source-block");
    if (
      resultBlock instanceof HTMLElement &&
      sourceBlock instanceof HTMLElement
    ) {
      resultBlock.innerHTML = "";
      sourceBlock.innerHTML = "";

      this.sentenceValidator.clearUserSentence();

      const unusedWordCards = [...this.wordCards];

      this.sentence.forEach((word) => {
        const wordCardIndex = unusedWordCards.findIndex(
          (card) => card.word === word,
        );
        if (wordCardIndex !== -1) {
          const wordCard = unusedWordCards[wordCardIndex];
          resultBlock.append(wordCard.element);
          wordCard.parent = resultBlock;
          this.sentenceValidator.addWord(word);

          unusedWordCards.splice(wordCardIndex, 1);
        }
      });

      this.update();
    }
  }

  update() {
    const resultBlock = document.querySelector(".result-block");
    if (resultBlock instanceof HTMLElement) {
      this.sentenceValidator.clearUserSentence();
      Array.from(resultBlock.children).forEach((child) => {
        const wordCard = this.wordCards.find((card) => card.element === child);
        if (wordCard) {
          this.sentenceValidator.addWord(wordCard.word);
        }
      });
    }

    const isCorrect = this.sentenceValidator.isCorrect();
    this.checkButton.setDisabled(
      this.sentenceValidator.userSentence.length !== this.sentence.length,
    );

    this.checkButton.setText(isCorrect ? "Continue" : "Check");
    this.autoCompleteButton.setDisabled(isCorrect);
  }

  updateVisualCues() {
    if (this.sentenceValidator.userSentence.length === this.sentence.length) {
      this.wordCards.forEach((wordCard) => wordCard.updateVisualCues());
    }
  }

  render() {
    this.container.innerHTML = "";

    const gameContainer = document.createElement("div");
    gameContainer.className = "game-container";

    gameContainer.addEventListener("dragover", this.handleDragOver.bind(this));
    gameContainer.addEventListener(
      "dragenter",
      this.handleDragEnter.bind(this),
    );
    gameContainer.addEventListener(
      "dragleave",
      this.handleDragLeave.bind(this),
    );
    gameContainer.addEventListener("drop", this.handleDrop.bind(this));

    const title = document.createElement("h1");
    title.textContent = "ENGLISH PUZZLE GAME";
    gameContainer.append(title);

    const sourceBlock = document.createElement("div");
    sourceBlock.className = "source-block";
    const resultBlock = document.createElement("div");
    resultBlock.className = "result-block";

    sourceBlock.addEventListener("dragover", this.handleDragOver.bind(this));
    sourceBlock.addEventListener("drop", this.handleDrop.bind(this));

    resultBlock.addEventListener("dragover", this.handleDragOver.bind(this));
    resultBlock.addEventListener("drop", this.handleDrop.bind(this));

    gameContainer.append(resultBlock);
    gameContainer.append(sourceBlock);

    const shuffledSentence = shuffleArray(this.sentence);
    this.sentenceValidator = new SentenceValidator(this.sentence);

    this.wordCards = shuffledSentence.map((word: string) => {
      const parent =
        word in this.sentenceValidator.userSentenceOrder
          ? resultBlock
          : sourceBlock;
      const card = new WordCard(word, parent, this.sentenceValidator, this);
      card.render();
      return card;
    });

    const controlPanel = document.createElement("div");
    controlPanel.className = "control-panel";

    this.autoCompleteButton.render(controlPanel);
    this.autoCompleteButton.element.classList.add("button-autocomplete");
    this.autoCompleteButton.setDisabled(false);

    this.checkButton.render(controlPanel);

    gameContainer.append(controlPanel);

    this.container.append(gameContainer);
  }
}

export default GamePage;
