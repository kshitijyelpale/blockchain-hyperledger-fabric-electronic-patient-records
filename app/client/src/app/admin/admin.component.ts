import { Component, OnInit } from '@angular/core';

import { PatientService } from '../patient/patient.service';
import { DisplayVal, PatientRecord, PatientViewRecord } from '../patient/patient';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  patientRecords: Array<PatientViewRecord> = [];
  headerNames = [
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
      const data = x as Array<PatientRecord>;
      this.patientRecords = data.map(y => new PatientViewRecord(y));
      console.log(this.patientRecords);
    });

    this.patientService.getPatientByKey('PID1').subscribe(x => {
      console.log(x);
    });
  }
}
