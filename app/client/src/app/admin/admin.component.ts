import { Component, OnInit } from '@angular/core';

import { PatientService } from '../patient/patient.service';
import { DisplayVal, PatientAdminViewRecord, PatientRecord, PatientViewRecord } from '../patient/patient';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public adminId: any;
  public patientRecords: Array<PatientAdminViewRecord> = [];
  public headerNames = [
    new DisplayVal(PatientViewRecord.prototype.patientId, 'Patient Id'),
    new DisplayVal(PatientViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(PatientViewRecord.prototype.lastName, 'Last Name')
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.adminId = params.adminId;
        this.refresh();
      });
  }

  public refresh(): void {
    this.patientService.fetchAllPatients().subscribe(x => {
      const data = x as Array<PatientRecord>;
      this.patientRecords = data.map(y => new PatientAdminViewRecord(y));
    });
  }
}
