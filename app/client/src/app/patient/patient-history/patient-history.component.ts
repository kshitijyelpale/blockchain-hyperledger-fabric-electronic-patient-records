import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit {
  public patientID: any;

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
    });
  }
}
