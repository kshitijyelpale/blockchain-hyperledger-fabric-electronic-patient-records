import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { PatientService } from '../patient.service';
import { DisplayVal, PatientViewRecord } from '../patient';
import { RoleEnum } from '../../utils';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit, OnDestroy {
  public patientID: any;
  public patientRecordHistoryObs$?: Observable<Array<PatientViewRecord>>;
  public data: any;
  private sub?: Subscription;
  headerNames = [
    new DisplayVal(PatientViewRecord.prototype.Timestamp, 'Date'),
    new DisplayVal(PatientViewRecord.prototype.changedBy, 'Last changed by'),
    new DisplayVal(PatientViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(PatientViewRecord.prototype.lastName, 'Last Name'),
    new DisplayVal(PatientViewRecord.prototype.age, 'Age'),
    new DisplayVal(PatientViewRecord.prototype.bloodGroup, 'Blood Group'),
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.isPatient()) {
      this.headerNames.push(
        new DisplayVal(PatientViewRecord.prototype.address, 'Address'),
        new DisplayVal(PatientViewRecord.prototype.phoneNumber, 'Contact number'),
        new DisplayVal(PatientViewRecord.prototype.emergPhoneNumber, 'Emergency number')
      );
    }
    this.headerNames.push(
      new DisplayVal(PatientViewRecord.prototype.allergies, 'Allergies'),
      new DisplayVal(PatientViewRecord.prototype.diagnosis, 'Diagnosis'),
      new DisplayVal(PatientViewRecord.prototype.symptoms, 'Symptoms'),
      new DisplayVal(PatientViewRecord.prototype.treatment, 'Treatment'),
      new DisplayVal(PatientViewRecord.prototype.followUp, 'Followup duration')
    );
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.patientID = params.patientId;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.patientRecordHistoryObs$ = this.patientService.getPatientHistoryByKey(this.patientID);
  }

  public isPatient(): boolean {
    return this.authService.getRole() === RoleEnum.PATIENT;
  }

  public convertToDate(val: any): string{
    return new Date(val.seconds.low * 1000).toDateString();
  }
}
