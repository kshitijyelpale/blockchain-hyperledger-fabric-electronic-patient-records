import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DoctorService } from '../doctor.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-doctor-new',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.scss']
})
export class DoctorRegisterComponent implements OnInit {
  public form: FormGroup;
  public error: any = null;

  public hospitalList = [
    {id: '1', name: 'Hospital 1'},
    {id: '2', name: 'Hospital 2'}
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly doctorService: DoctorService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      hospitalId: ['', Validators.required],
      speciality: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    this.form.reset();
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }

  public save(): void {
    console.log(this.form.value);
    this.doctorService.createDoctor(this.form.value).subscribe(x => {
      const docRegResponse = x;
      if (docRegResponse.error) {
        this.error = docRegResponse.error;
      }
      this.router.navigate(['/', 'admin/', this.getAdminUsername()]);
    });
  }
}
