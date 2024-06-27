import "./styles.css";
import LoginStatus from "../LoginStatus/LoginStatus";

class StartScreen {
  private container: HTMLElement;

  private loginStatus: LoginStatus;

  // eslint-disable-next-line class-methods-use-this
  onStart: () => void = () => {};

  // eslint-disable-next-line class-methods-use-this
  onLogout: () => void = () => {};

  constructor(container: HTMLElement, loginStatus: LoginStatus) {
    this.container = container;
    this.loginStatus = loginStatus;
  }

  render() {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    this.container.innerHTML = "";

    const div = document.createElement("div");
    div.className = "start-container";

    const h1 = document.createElement("h1");
    h1.textContent = "RSS Puzzle";
    div.append(h1);

    const p = document.createElement("p");
    const nameSpan = document.createElement("span");
    nameSpan.className = "animated-name";
    nameSpan.textContent = `${firstName} ${lastName}`;

    const textNode1 = document.createTextNode("Welcome, ");
    const textNode2 = document.createTextNode(
      ", to RSS Puzzle, an interactive and engaging mini-game designed to enhance your English language skills! In this game, you will assemble sentences from jumbled words. With various levels of difficulty and helpful hint options, you will be challenged and entertained at every turn. So, are you ready to navigate through the challenges of this puzzle game? Best of luck, and enjoy your linguistic journey with RSS Puzzle!",
    );

    p.append(textNode1);
    p.append(nameSpan);
    p.append(textNode2);
    div.append(p);

    const startButton = document.createElement("button");
    startButton.textContent = "Start";
    startButton.className = "start-button";
    startButton.addEventListener("click", () => {
      if (this.onStart) this.onStart();
    });
    div.append(startButton);

    this.container.append(div);

    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.className = "logout-button";
    logoutButton.addEventListener("click", () => {
      if (this.onLogout) this.onLogout();
    });
    div.append(logoutButton);
  }
}

export default StartScreen;
