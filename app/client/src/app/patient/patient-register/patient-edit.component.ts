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
  private patientId: any;
  public title = '';
  public currentUrl = '';
  public previousUrl = '';

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
      age: ['', [ Validators.required, Validators.min(0), Validators.max(150)]],
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
        this.setTitle();
        if (this.isNew()) {
          this.refresh();
        }
        else {
          this.patientService.getPatientByKey(this.patientId).subscribe(x => {
            const data = x as PatientRecord;
            this.loadRecord(data);
          });
        }
      });
  }

  public refresh(): void {
    this.form.reset();
  }

  public isNew(): boolean {
    return this.patientId === 'new';
  }

  public isPatient(): boolean {
    // TODO: remove admin from this condition at the end of web app development
    return this.authService.getRole() === RoleEnum.PATIENT || this.authService.getRole() === RoleEnum.ADMIN;
  }
  public isDoctor(): boolean {
    // TODO: remove admin from this condition at the end of web app development
    return this.authService.getRole() === RoleEnum.DOCTOR || this.authService.getRole() === RoleEnum.ADMIN;
  }

  public save(): void {
    console.log(this.form.value);
  }

  private setTitle(): void {
    this.title = this.isNew() ? 'Create' : 'Edit' + ' Patient';
  }

  private loadRecord(record: PatientRecord): void {
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
}
