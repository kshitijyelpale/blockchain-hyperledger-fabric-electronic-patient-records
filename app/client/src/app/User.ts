export class User {
  role: string;
  username: string;
  password: string;

  constructor(role: string, username: string, pwd: string) {
    this.role = role;
    this.username = username;
    this.password = pwd;
  }
}

export class HospitalUser extends User {
  hospitalId: number;

  constructor(role: string, hospitalId: number, username: string, pwd: string) {
    super(role, username, pwd);
    this.hospitalId = hospitalId;
  }
}
