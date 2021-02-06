import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';

import { HospitalUser, User } from '../../User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:3001/login';

  constructor(private http: HttpClient, private router: Router) { }

  public loginAdminUser(adminUser: HospitalUser): any {
    return this.http.post<any>(this.loginUrl, adminUser);
  }

  public loginDoctorUser(doctorUser: HospitalUser): any {
    return this.http.post<any>(this.loginUrl + '/doctor', doctorUser);
  }

  public loginPatientUser(patientUser: User): any {
    return this.http.post<any>(this.loginUrl + '/patient', patientUser);
  }

  public logoutUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  public loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getRole(): string {
    return localStorage.getItem('role') as string;
  }
}
