import { Component, OnInit } from '@angular/core';

import { PatientService } from '../patient/patient.service';

export interface PatientRecord {
  // patientId: string;
  firstName: string;
  lastName: string;
  address: string;
  age: number;
  allergies: boolean;
  diagnosis: string;
  docType: string;
  emergPhoneNumber: string;
  followUp: string;
  phoneNumber: string;
  symptoms: string;
  treatment: string;
}

export interface ResRecord {
  Key: string;
  Record: PatientRecord;
}

export class PatientViewRecord {
  patientId = '';
  firstName = '';
  lastName = '';
  address = '';
  age = 0;
  allergies = false;
  diagnosis = '';
  docType = '';
  emergPhoneNumber = '';
  followUp = '';
  phoneNumber = '';
  symptoms = '';
  treatment = '';

  constructor(readonly patientRecord: PatientRecord, patientId: string) {
    this.patientId = patientId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    this.address = patientRecord.address;
    this.age = patientRecord.age;
    this.allergies = patientRecord.allergies;
    this.docType = patientRecord.docType;
    this.emergPhoneNumber = patientRecord.emergPhoneNumber;
    this.followUp = patientRecord.followUp;
    this.phoneNumber = patientRecord.phoneNumber;
    this.symptoms = patientRecord.symptoms;
    this.treatment = patientRecord.treatment;
  }
}

export class DisplayVal {
  keyName: string;
  displayName: string;

  constructor(key: string, value: string) {
    this.keyName = key;
    this.displayName = value;
  }
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  patientRecords: Array<PatientViewRecord> = [];
  headerNames: Array<DisplayVal> = [
    new DisplayVal('patientId', 'Patient Id'),
    new DisplayVal('firstName', 'First Name'),
    new DisplayVal('lastName', 'Last Name')
  ];

  constructor(private readonly patientService: PatientService) { }

  ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    this.patientService.fetchAllPatients().subscribe(x => {
      const data = x as Array<ResRecord>;
      this.patientRecords = data.map(y => new PatientViewRecord(y.Record, y.Key));
      console.log(this.patientRecords);
    });

    this.patientService.getPatientByKey('PID1').subscribe(x => {
      console.log(x);
    });
  }
}
