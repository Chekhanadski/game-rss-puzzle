class Button {
  element: HTMLButtonElement;

  constructor(text: string, onClick: () => void) {
    this.element = document.createElement("button");
    this.element.textContent = text;
    this.element.addEventListener("click", onClick);
  }

  render(parent: HTMLElement) {
    parent.append(this.element);
  }

  setDisabled(disabled: boolean) {
    this.element.disabled = disabled;
  }

  setText(text: string) {
    this.element.textContent = text;
  }
}

export default Button;
