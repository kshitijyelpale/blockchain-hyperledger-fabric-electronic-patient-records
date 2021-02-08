import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';

import { HospitalUser, User } from '../../User';
import { BrowserStorageFields } from '../../utils';

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
    return this.http.post<any>(this.loginUrl, doctorUser);
  }

  public loginPatientUser(patientUser: User): any {
    return this.http.post<any>(this.loginUrl, patientUser);
  }

  public logoutUser(): void {
    localStorage.removeItem(BrowserStorageFields.TOKEN);
    localStorage.removeItem(BrowserStorageFields.USER_ROLE);
    localStorage.removeItem(BrowserStorageFields.USERNAME);
    this.router.navigate(['/login']);
  }

  public loggedIn(): boolean {
    return !!localStorage.getItem(BrowserStorageFields.TOKEN);
  }

  public getToken(): string | null {
    return localStorage.getItem(BrowserStorageFields.TOKEN);
  }

  public getRole(): string {
    return localStorage.getItem(BrowserStorageFields.USER_ROLE) as string;
  }

  public getUsername(): string {
    return localStorage.getItem(BrowserStorageFields.USERNAME) as string;
  }
}
