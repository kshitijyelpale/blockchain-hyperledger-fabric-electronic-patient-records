export class User {
  role: string;
  username: string;
  password: string;
  newPassword = '';

  constructor(role: string, username: string, pwd: string, newPwd = '') {
    this.role = role;
    this.username = username;
    this.password = pwd;
    this.newPassword = newPwd;
  }
}

export class HospitalUser extends User {
  hospitalId: number;

  constructor(role: string, hospitalId: number, username: string, pwd: string) {
    super(role, username, pwd);
    this.hospitalId = hospitalId;
  }
}
