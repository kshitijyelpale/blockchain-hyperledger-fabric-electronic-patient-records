import { Component, OnInit } from '@angular/core';

import { PatientService } from '../patient/patient.service';
import { DisplayVal, PatientAdminViewRecord, PatientRecord, PatientViewRecord } from '../patient/patient';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public patientRecords: Array<PatientAdminViewRecord> = [];
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
    this.patientService.fetchAllPatients().subscribe(x => {
      const data = x as Array<PatientRecord>;
      this.patientRecords = data.map(y => new PatientAdminViewRecord(y));
    });
  }
}
