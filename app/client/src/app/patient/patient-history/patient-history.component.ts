import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PatientService } from '../patient.service';
import { DisplayVal, PatientRecord, PatientViewRecord } from '../patient';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit {
  public patientID: any;
  patientRecordHistory: Array<PatientViewRecord> = [];
  headerNames = [
    new DisplayVal('patientId', 'Patient Id'),
    new DisplayVal('date', 'Date '),
    new DisplayVal('firstName', 'First Name'),
    new DisplayVal('lastName', 'Last Name'),
    new DisplayVal('address', 'Address'),
    new DisplayVal('age', 'Age'),
    new DisplayVal('phoneNumber', 'Contact number'),
    new DisplayVal('allergies', 'Allergies'),
    new DisplayVal('diagnosis', 'Diagnosis'),
    new DisplayVal('symptoms', 'Symptoms'),
    new DisplayVal('treatment', 'Treatment'),
    new DisplayVal('followUp', 'Followup duration'),
    new DisplayVal('emergPhoneNumber', 'Emergency number')
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.patientID = params.patientId;
        this.refresh();
      });
  }

  public refresh(): void {
    this.patientService.getPatientHistoryByKey(this.patientID).subscribe(x => {
      console.log(x);
      const data: PatientRecord = JSON.parse(JSON.stringify(x[0]));
      console.log('data:=>>>>>>>' + typeof data);
      console.log(data.timestamp);
      // this.patientRecordHistory = data.map((y: PatientRecord) => new PatientViewRecord(y));
      console.log('history');
      // console.log(this.patientRecordHistory);
    });
  }
}
