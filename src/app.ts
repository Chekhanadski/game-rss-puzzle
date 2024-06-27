import { UserNameEntry } from "./components/UserNameEntry/UserNameEntry";
import LoginStatus from "./components/LoginStatus/LoginStatus";
import Router from "./components/Router/Router";

const entry = new UserNameEntry();
entry.setFirstName("First Name");
entry.setLastName("Last Name");

const loginStatus = new LoginStatus(entry);
const router = new Router(document.body, loginStatus);

const initialPath = loginStatus.getInitialPath();
router.navigate(initialPath);

export default entry;
