import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private doctorURL = 'http://localhost:3001/doctors';

  constructor(private http: HttpClient) { }

  public createDoctor(data: any): Observable<any> {
    return this.http.post(this.doctorURL + '/register', data);
  }

  public getDoctorsByHospitalId(hospitalId: number): Observable<any> {
    return this.http.get(this.doctorURL + `/${hospitalId}/_all`);
  }

  public getDoctorByHospitalId(hospitalId: string, docId: any): Observable<any> {
    return this.http.get(this.doctorURL + `/${hospitalId}/${docId}`);
  }
}
