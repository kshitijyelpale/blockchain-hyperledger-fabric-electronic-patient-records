import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PatientService } from './patient.service';
import { PatientRecord, PatientViewRecord } from './patient';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  public patientID: any;
  public patientRecord: PatientViewRecord | undefined;

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
    this.patientService.getPatientByKey(this.patientID).subscribe(x => {
      const data = x as PatientRecord;
      this.patientRecord = new PatientViewRecord(data);
    });
  }
}
