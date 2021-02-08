import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-doctor-list-for-patient',
  templateUrl: './doctor-list-for-patient.component.html',
  styleUrls: ['./doctor-list-for-patient.component.scss']
})
export class DoctorListForPatientComponent implements OnInit {
  public patientID: any;

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.patientID = params.patientId;
        this.refresh();
      });
  }

  public refresh(): void {

  }
}
