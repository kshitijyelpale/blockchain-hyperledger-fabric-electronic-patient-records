import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { DoctorService } from '../doctor.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-doctor-new',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.scss']
})
export class DoctorRegisterComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public error: any = null;

  public hospitalList = [
    {id: '1', name: 'Hospital 1'},
    {id: '2', name: 'Hospital 2'},
    {id: '3', name: 'Hospital 3'}
  ];
  private sub?: Subscription;

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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.form.reset();
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }

  public save(): void {
    console.log(this.form.value);
    this.sub = this.doctorService.createDoctor(this.form.value).subscribe(x => {
      const docRegResponse = x;
      if (docRegResponse.error) {
        this.error = docRegResponse.error;
      }
      this.router.navigate(['/', 'admin', this.getAdminUsername()]);
    });
  }
}
