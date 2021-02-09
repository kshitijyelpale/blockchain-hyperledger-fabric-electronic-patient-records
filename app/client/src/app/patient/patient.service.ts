import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private patientURL = 'http://localhost:3001/patients';

  constructor(private http: HttpClient) { }

  public fetchAllPatients(): Observable<any> {
    return this.http.get(this.patientURL + '/_all');
  }

  public getPatientByKey(key: string): Observable<any> {
    return this.http.get(this.patientURL + `/${key}`);
  }

  public getPatientHistoryByKey(key: string): Observable<any> {
    return this.http.get(this.patientURL + `/${key}/history`);
  }

  public createPatient(patientData: any): Observable<any> {
    return this.http.post(this.patientURL + '/register', patientData);
  }

  public updatePatientPersonalDetails(key: string, data: any): Observable<any> {
    return this.http.patch(this.patientURL + `/${key}/details/personal`, data);
  }

  public updatePatientMedicalDetails(key: string, data: any): Observable<any> {
    return this.http.patch(this.patientURL + `/${key}/details/medical`, data);
  }

  public grantAccessToDoctor(patientId: string, doctorId: string): Observable<any> {
    return this.http.patch(this.patientURL + `/${patientId}/grant/${doctorId}`, {});
  }

  public revokeAccessFromDoctor(patientId: string, doctorId: string): Observable<any> {
    return this.http.patch(this.patientURL + `/${patientId}/revoke/${doctorId}`, {});
  }
}
