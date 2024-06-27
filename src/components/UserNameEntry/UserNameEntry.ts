import "./styles.css";
import User from "../User/User";
import LoginStatus from "../LoginStatus/LoginStatus";
import Router from "../Router/Router";

export class UserNameEntry extends User {
  canSubmit(): boolean {
    return (
      this.firstName !== "" &&
      this.lastName !== "" &&
      this.firstName.length >= 3 &&
      this.lastName.length >= 4 &&
      /^[A-Z][a-zA-Z-]*$/.test(this.firstName) &&
      /^[A-Z][a-zA-Z-]*$/.test(this.lastName)
    );
  }
}

export function createForm(router: Router) {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  const title = document.createElement("h1");
  title.textContent = "ENGLISH PUZZLE GAME";
  wrapper.append(title);

  const subtitle = document.createElement("h2");
  subtitle.textContent = "Enter your details";
  wrapper.append(subtitle);

  const form = document.createElement("form");
  const firstNameInput = document.createElement("input");
  const lastNameInput = document.createElement("input");
  const firstNameError = document.createElement("div");
  const lastNameError = document.createElement("div");
  const submitButton = document.createElement("button");

  firstNameInput.placeholder = "First Name";
  lastNameInput.placeholder = "Last Name";
  submitButton.textContent = "Login";

  form.append(firstNameInput);
  form.append(firstNameError);
  form.append(lastNameInput);
  form.append(lastNameError);
  form.append(submitButton);

  wrapper.append(form);

  document.body.append(wrapper);

  const entry = new UserNameEntry();
  const loginStatus = new LoginStatus(entry);

  firstNameInput.addEventListener("input", (event) => {
    const input = (event.target as HTMLInputElement).value;
    entry.setFirstName(input);

    if (!/^[A-Za-z-]*$/.test(input)) {
      firstNameError.textContent =
        "⚠️ First Name must contain only English letters and hyphens";
      firstNameError.classList.add("error-message");
    } else if (!/^[A-Z]/.test(input)) {
      firstNameError.textContent =
        "⚠️ First Name must start with an uppercase letter";
      firstNameError.classList.add("error-message");
    } else if (input.length < 3 && input.length > 0) {
      firstNameError.textContent =
        "⚠️ First Name must be at least 3 characters";
      firstNameError.classList.add("error-message");
    } else {
      firstNameError.textContent = "";
    }
    submitButton.disabled = !entry.canSubmit();
  });

  lastNameInput.addEventListener("input", (event) => {
    const input = (event.target as HTMLInputElement).value;
    entry.setLastName(input);
    if (!/^[A-Za-z-]*$/.test(input)) {
      lastNameError.textContent =
        "⚠️ Last Name must contain only English letters and hyphens";
      lastNameError.classList.add("error-message");
    } else if (!/^[A-Z]/.test(input)) {
      lastNameError.textContent =
        "⚠️ Last Name must start with an uppercase letter";
      lastNameError.classList.add("error-message");
    } else if (input.length < 4 && input.length > 0) {
      lastNameError.textContent = "⚠️ Last Name must be at least 4 characters";
      lastNameError.classList.add("error-message");
    } else {
      lastNameError.textContent = "";
    }
    submitButton.disabled = !entry.canSubmit();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    firstNameInput.classList.remove("input-error");
    lastNameInput.classList.remove("input-error");
    firstNameError.textContent = "";
    lastNameError.textContent = "";

    if (entry.canSubmit()) {
      localStorage.setItem("firstName", entry.firstName);
      localStorage.setItem("lastName", entry.lastName);

      loginStatus.isLoggedIn = true;

      if (loginStatus.isLoggedIn) {
        router.navigate("/start");
      }
    } else {
      if (entry.firstName === "" || entry.firstName.length < 3) {
        firstNameInput.classList.add("input-error");
        firstNameError.textContent = "First Name must be at least 3 characters";
        firstNameError.classList.add("error-message");
      }
      if (entry.lastName === "" || entry.lastName.length < 4) {
        lastNameInput.classList.add("input-error");
        lastNameError.textContent = "Last Name must be at least 4 characters";
        lastNameError.classList.add("error-message");
      }
    }
  });
}
