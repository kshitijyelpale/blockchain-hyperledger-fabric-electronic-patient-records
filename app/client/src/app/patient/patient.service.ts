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
    // @ts-ignore
    return this.http.get(this.patientURL + '/_all');
  }

  public getPatientByKey(key: string): Observable<any> {
    return this.http.get(this.patientURL + `/${key}`);
  }
}
