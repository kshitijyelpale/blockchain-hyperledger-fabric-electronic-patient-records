import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-new',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.scss']
})
export class DoctorRegisterComponent implements OnInit {
  public form: FormGroup;
  public error: any = null;

  public hospitalList = [
    {id: 'hosp1', name: 'Hospital 1'},
    {id: 'hosp2', name: 'Hospital 2'}
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly doctorService: DoctorService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      hospital: ['', Validators.required],
      speciality: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    this.form.reset();
  }

  public save(): void {
    console.log(this.form.value);
  }
}
