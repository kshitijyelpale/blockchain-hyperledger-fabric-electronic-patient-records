import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PatientService } from '../patient.service';
import { PatientRecord } from '../patient';
import { RoleEnum } from '../../utils';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-patient-new',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.scss']
})
export class PatientEditComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public error: any = null;
  public title = '';
  public patientId: any;
  public newPatientData: any;
  private allSub = new Subscription();

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
      allergies: [''],
      symptoms: [''],
      diagnosis: [''],
      treatment: [''],
      followUp: ['']
    });
  }

  ngOnInit(): void {
    this.allSub.add(
      this.route.params.subscribe((params: Params) => {
        this.patientId = params.self;
        this.refresh();
      })
    );
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  public refresh(): void {
    this.setTitle();
    if (this.isNew()) {
      this.form.reset();
    }
    else {
      this.allSub.add(
        this.patientService.getPatientByKey(this.patientId).subscribe(x => {
          const data = x as PatientRecord;
          this.loadRecord(data);
        })
      );
    }
    this.error = null;
  }

  public isNew(): boolean {
    return this.patientId === 'new';
  }

  public isPatient(): boolean {
    return this.authService.getRole() === RoleEnum.PATIENT;
  }

  public isDoctor(): boolean {
    return this.authService.getRole() === RoleEnum.DOCTOR;
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }

  public save(): void {
    if (this.isNew()) {
      this.allSub.add(
        this.patientService.createPatient(this.form.value).subscribe(x => this.newPatientData = x)
      );
    }
    else if (this.isPatient()) {
      this.allSub.add(
        this.patientService.updatePatientPersonalDetails(this.patientId, this.form.value).subscribe(x => {
          const response = x;
          if (response.error) {
            this.error = response.error;
          }
          this.router.navigate(['/', 'patient', this.patientId]);
        })
      );
    }
    else {
      this.allSub.add(
        this.patientService.updatePatientMedicalDetails(this.patientId, this.form.value).subscribe(x => {
          const response = x;
          if (response.error) {
            this.error = response.error;
          }
          this.router.navigate(['/', 'patient', this.patientId]);
        })
      );
    }
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

  public reset(): void {
    this.newPatientData = null;
    this.router.navigate(['/', 'admin', this.getAdminUsername()]);
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
    // tslint:disable-next-line:forin
    for (const key in this.form.controls) {
      this.form.get(key)?.clearValidators();
      this.form.get(key)?.updateValueAndValidity();
    }
    // this.findInvalidControls();
  }
}
