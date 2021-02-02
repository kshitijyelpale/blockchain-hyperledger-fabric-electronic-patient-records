import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-new',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.scss']
})
export class PatientRegisterComponent implements OnInit {
  public form: FormGroup;
  public error: any = null;

  public bloodGroupTypes = [
    {id: 'a+', name: 'A +'},
    {id: 'a-', name: 'A -'},
    {id: 'b+', name: 'B +'},
    {id: 'b-', name: 'B -'},
    {id: 'ab+', name: 'AB +'},
    {id: 'ab-', name: 'AB -'},
    {id: 'o+', name: 'O +'},
    {id: 'o-', name: 'O -'}
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly patientService: PatientService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      age: ['', [ Validators.required, Validators.min(0), Validators.max(150)]],
      phoneNumber: ['', Validators.required],
      emergPhoneNumber: ['', Validators.required],
      bloodGroup: ['', Validators.required]
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
