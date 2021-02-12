import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { PatientService } from '../../patient/patient.service';
import { DisplayVal, PatientDoctorViewRecord, PatientViewRecord } from '../../patient/patient';

@Component({
  selector: 'app-patient-list-for-doctor',
  templateUrl: './patient-list-for-doctor.component.html',
  styleUrls: ['./patient-list-for-doctor.component.scss']
})
export class PatientListForDoctorComponent implements OnInit {
  public patientRecordsObs$?: Observable<Array<PatientDoctorViewRecord>>;
  public headerNames = [
    new DisplayVal(PatientViewRecord.prototype.patientId, 'Patient Id'),
    new DisplayVal(PatientViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(PatientViewRecord.prototype.lastName, 'Last Name')
  ];

  constructor(private readonly patientService: PatientService) { }

  ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    this.patientRecordsObs$ = this.patientService.fetchAllPatients();
  }
}
