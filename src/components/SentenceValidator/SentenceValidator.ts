class SentenceValidator {
  correctSentence: string[];

  userSentence: string[];

  userSentenceOrder: { [key: string]: number };

  wordCounts: { [key: string]: number };

  constructor(correctSentence: string[]) {
    this.userSentenceOrder = {};
    this.correctSentence = correctSentence;
    this.userSentence = [];
    this.wordCounts = this.correctSentence.reduce(
      (counts, word) => ({ ...counts, [word]: (counts[word] || 0) + 1 }),
      {} as { [key: string]: number },
    );
  }

  addWord(word: string) {
    this.userSentence.push(word);
    if (this.wordCounts[word] > 0) {
      this.wordCounts[word] -= 1;
    }
  }

  removeWord(word: string) {
    const index = this.userSentence.lastIndexOf(word);
    if (index !== -1) {
      this.userSentence.splice(index, 1);
      this.wordCounts[word] += 1;
    }
  }

  isCorrect(): boolean {
    const isCorrect =
      this.correctSentence.join(" ") === this.userSentence.join(" ");
    return isCorrect;
  }

  isCorrectPlacement(word: string): boolean {
    const userIndex = this.userSentence.indexOf(word);
    const correctIndex = this.correctSentence.indexOf(word);
    return userIndex === correctIndex;
  }

  clearUserSentence() {
    this.userSentence = [];
  }
}

export default SentenceValidator;
