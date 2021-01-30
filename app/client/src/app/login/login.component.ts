import {Component, OnInit, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../core/auth/auth.service';
import { HospitalUser, User } from '../User';

// require('crypto-ts');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public showHospList = true;
  public role = '';
  public hospitalName = '';
  public username = '';
  public pwd = '';

  constructor(private authService: AuthService,
              private router: Router,
              private readonly modal: NgbModal
  ) { }

  ngOnInit(): void {
  }

  public resetFields(): void {
    this.role = '';
    this.hospitalName = '';
    this.username = '';
    this.pwd = '';
  }

  public roleChanged(): void {
    this.showHospList = this.role !== 'patient';
  }

  public loginUser(): void {
    // this.pwd = crypto.createHash('sha256').update(this.pwd).digest('hex');
    console.log(this.role + this.username + this.pwd + this.hospitalName);
    switch (this.role) {
      case 'admin':
        this.authService.loginAdminUser(new HospitalUser(this.role, this.hospitalName, this.username, this.pwd))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => console.error(err)
          );
        break;
      case 'doctor':
        this.authService.loginDoctorUser(new HospitalUser(this.role, this.hospitalName, this.username, this.pwd))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => console.error(err)
          );
        break;
      case 'patient':
        this.authService.loginPatientUser(new User(this.role, this.username, this.pwd))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => console.error(err)
          );
        break;
    }
  }

  public loginPatient(patientPassword: TemplateRef<any>): void {
    console.log('cdc');
    this.modal.open(patientPassword).result.then(() => {
      this.loginUser();
    });
  }

  private afterSuccessfulLogin(res: any): void {
    console.log(res);
    localStorage.setItem('token', res.accessToken);
    const role = this.role;
    localStorage.setItem('role', role);
    this.resetFields();
    this.router.navigate([role]);
  }
}
