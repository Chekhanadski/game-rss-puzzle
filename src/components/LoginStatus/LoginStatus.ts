import User from "../User/User";

class LoginStatus {
  user: User;

  isLoggedIn: boolean;

  constructor(user: User) {
    this.user = user;
    this.isLoggedIn = this.checkLoginStatus();
  }

  checkLoginStatus(): boolean {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (firstName && lastName) {
      this.user.setFirstName(firstName);
      this.user.setLastName(lastName);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    this.isLoggedIn = false;
    this.user.setFirstName("");
    this.user.setLastName("");
  }

  getInitialPath(): string {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (firstName && lastName) {
      return window.location.pathname;
    }
    if (this.isLoggedIn) {
      return "/start";
    }
    return "/login";
  }
}

export default LoginStatus;
