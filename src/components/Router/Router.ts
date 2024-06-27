import { createForm } from "../UserNameEntry/UserNameEntry";
import StartScreen from "../StartScreen/StartScreen";
import LoginStatus from "../LoginStatus/LoginStatus";
import GamePage from "../GamePage/GamePage";

class Router {
  currentPath: string;

  container: HTMLElement;

  loginStatus: LoginStatus;

  startScreen: StartScreen;

  gamePage: GamePage;

  constructor(container: HTMLElement, loginStatus: LoginStatus) {
    this.container = container;
    this.loginStatus = loginStatus;
    this.currentPath = window.location.hash.slice(1);
    this.startScreen = new StartScreen(this.container, this.loginStatus);
    this.startScreen.onStart = () => this.navigate("/game");
    this.startScreen.onLogout = () => {
      this.loginStatus.logout();
      this.navigate("/");
    };
    window.onhashchange = () => {
      this.currentPath = window.location.hash.slice(1);
      this.route();
    };
    this.gamePage = new GamePage(this.container);

    if (this.loginStatus.isLoggedIn) {
      const currentPath = window.location.hash.slice(1);
      if (currentPath === "/game") {
        this.navigate("/game");
      } else {
        this.navigate("/start");
      }
    } else {
      this.navigate("/");
    }
    window.addEventListener("storage", () => {
      if (!this.loginStatus.isLoggedIn) {
        this.navigate("/login");
      }
    });
  }

  navigate(path: string) {
    window.location.hash = path;
    this.currentPath = path;
    this.route();
  }

  route() {
    this.container.innerHTML = "";
    if (this.currentPath === "/start") {
      this.startScreen.render();
    } else if (this.currentPath === "/game") {
      this.loadGamePage();
    } else {
      Router.loadLoginPage(this);
    }
  }

  loadStartPage() {
    this.startScreen.render();
  }

  loadGamePage() {
    this.gamePage.render();
  }

  static loadLoginPage(router: Router) {
    createForm(router);
  }
}

export default Router;
