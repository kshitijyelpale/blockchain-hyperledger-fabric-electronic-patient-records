import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DoctorService } from '../doctor.service';
import { DoctorRecord, DoctorViewRecord } from '../doctor';
import { DisplayVal } from '../../patient/patient';
import { PatientService } from '../../patient/patient.service';

@Component({
  selector: 'app-doctor-list-for-patient',
  templateUrl: './doctor-list-for-patient.component.html',
  styleUrls: ['./doctor-list-for-patient.component.scss']
})
export class DoctorListForPatientComponent implements OnInit {
  public patientID: any;
  public doctorRecords: Array<DoctorViewRecord> = [];
  public permissions = [];
  public headerNames = [
    new DisplayVal(DoctorViewRecord.prototype.doctorId, 'Doctor Id'),
    new DisplayVal(DoctorViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(DoctorViewRecord.prototype.lastName, 'Last Name')
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
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
    this.doctorRecords = [];
    this.patientService.getPatientByKey(this.patientID).subscribe(x => {
      this.permissions = x.permissionGranted;
      this.fetchDoctorData();
    });
  }

  public fetchDoctorData(): void {
    this.doctorService.getDoctorsByHospitalId(1).subscribe(x => {
      const data = x as Array<DoctorRecord>;
      data.map(y => this.doctorRecords.push(new DoctorViewRecord(y)));
    });
    this.doctorService.getDoctorsByHospitalId(2).subscribe(x => {
      const data = x as Array<DoctorRecord>;
      data.map(y => this.doctorRecords.push(new DoctorViewRecord(y)));
    });
  }

  public grant(doctorId: string): void {
    this.patientService.grantAccessToDoctor(this.patientID, doctorId).subscribe(x => {
      console.log(x);
      this.refresh();
    });
  }

  public revoke(doctorId: string): void {
    this.patientService.revokeAccessFromDoctor(this.patientID, doctorId).subscribe(x => {
      console.log(x);
      this.refresh();
    });
  }

  public isDoctorPresent(doctorId: string): boolean {
    // @ts-ignore
    return this.permissions.includes(doctorId);
  }
}
