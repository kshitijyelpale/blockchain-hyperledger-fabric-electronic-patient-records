import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { PatientService } from '../patient.service';
import {PatientRecord} from '../patient';
import {RoleEnum} from '../../utils';
import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'app-patient-new',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.scss']
})
export class PatientEditComponent implements OnInit {
  public form: FormGroup;
  public error: any = null;
  public title = '';
  public currentUrl = '';
  public previousUrl = '';
  public patientId: any;

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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly patientService: PatientService,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      age: ['', [ Validators.required, Validators.min(0), Validators.max(150), Validators.maxLength(3)]],
      phoneNumber: ['', Validators.required],
      emergPhoneNumber: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      allergies: ['', Validators.required],
      symptoms: ['', Validators.required],
      diagnosis: ['', Validators.required],
      treatment: ['', Validators.required],
      followUp: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.patientId = params.self;
        this.refresh();
      });
  }

  public refresh(): void {
    this.setTitle();
    if (this.isNew()) {
      this.form.reset();
      this.clearValidators();
    }
    else {
      this.patientService.getPatientByKey(this.patientId).subscribe(x => {
        const data = x as PatientRecord;
        this.loadRecord(data);
      });
    }
    console.log(this.form.controls);
  }

  public isNew(): boolean {
    return this.patientId === 'new';
  }

  public isPatient(): boolean {
    // TODO: remove admin from this condition at the end of web app development
    return this.authService.getRole() === RoleEnum.PATIENT;
  }

  public isDoctor(): boolean {
    // TODO: remove admin from this condition at the end of web app development
    return this.authService.getRole() === RoleEnum.DOCTOR;
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }

  public save(): void {
    console.log(this.form.value);
  }

  public findInvalidControls(): void {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }


  private setTitle(): void {
    this.title = (this.isNew() ? 'Create' : 'Edit') + ' Patient';
  }

  private loadRecord(record: PatientRecord): void {
    this.clearValidators();
    if (this.isPatient()) {
      this.form.patchValue({
        firstName: record.firstName,
        lastName: record.lastName,
        address: record.address,
        age: record.age,
        phoneNumber: record.phoneNumber,
        emergPhoneNumber: record.emergPhoneNumber
      });
    }
    else {
      this.form.patchValue({
        allergies: record.allergies,
        symptoms: record.symptoms,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        followUp: record.followUp
      });
    }

  }

  private clearValidators(): void {
    if (this.isPatient() || this.isNew()) {
      this.form.get('allergies')?.clearValidators();
      this.form.get('symptoms')?.clearValidators();
      this.form.get('diagnosis')?.clearValidators();
      this.form.get('treatment')?.clearValidators();
      this.form.get('followUp')?.clearValidators();
    }
    else {
      this.form.get('firstName')?.clearValidators();
      this.form.get('lastName')?.clearValidators();
      this.form.get('address')?.clearValidators();
      this.form.get('age')?.clearValidators();
      this.form.get('phoneNumber')?.clearValidators();
      this.form.get('emergPhoneNumber')?.clearValidators();
    }

    if (!this.isNew()) {
      this.form.get('bloodGroup')?.clearValidators();
    }
  }
}
