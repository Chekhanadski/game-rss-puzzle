class User {
  firstName: string;

  lastName: string;

  constructor() {
    this.firstName = "";
    this.lastName = "";
  }

  setFirstName(name: string) {
    this.firstName = name;
  }

  setLastName(name: string) {
    this.lastName = name;
  }
}

export default User;
