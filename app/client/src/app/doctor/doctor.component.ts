import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
  public doctorId: any;

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.doctorId = params.doctorId;
        this.refresh();
      });
  }

  public refresh(): void {

  }
}
