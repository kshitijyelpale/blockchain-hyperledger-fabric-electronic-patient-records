import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';

import { tap } from 'rxjs/operators';

import { HospitalUser, User } from '../../User';
import { BrowserStorageFields } from '../../utils';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private serverUrl = 'http://localhost:3001';
  private loginUrl = `${this.serverUrl}/login`;

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

  public getNewAccessToken(): any {
    return this.http.post(`${this.serverUrl}/token`, { token: this.getRefreshToken() })
      .pipe(
        tap((res: any) => {
          this.setToken(res.accessToken);
        }));
  }

  public setHeaders(res: any, role: string, hospitalId: number, username: string): void {
    localStorage.setItem(BrowserStorageFields.TOKEN, res.accessToken);
    localStorage.setItem(BrowserStorageFields.REFRESH_TOKEN, res.refreshToken);
    localStorage.setItem(BrowserStorageFields.USER_ROLE, role);
    localStorage.setItem(BrowserStorageFields.HOSPITAL_ID, String(hospitalId));
    localStorage.setItem(BrowserStorageFields.USERNAME, username);
  }

  public logoutUser(): void {
    this.clearSession();

    this.router.navigate(['/login']);
  }

  public logout(): any {
    return this.http.delete(this.serverUrl + '/logout');
  }

  public loggedIn(): boolean {
    return !!localStorage.getItem(BrowserStorageFields.TOKEN);
  }

  public setToken(token: string): void {
    localStorage.setItem(BrowserStorageFields.TOKEN, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(BrowserStorageFields.TOKEN);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(BrowserStorageFields.REFRESH_TOKEN);
  }

  public getRole(): string {
    return localStorage.getItem(BrowserStorageFields.USER_ROLE) as string;
  }

  public getHospitalId(): string {
    return JSON.parse(localStorage.getItem(BrowserStorageFields.HOSPITAL_ID) as string);
  }

  public getUsername(): string {
    return localStorage.getItem(BrowserStorageFields.USERNAME) as string;
  }

  public clearSession(): void {
    localStorage.removeItem(BrowserStorageFields.TOKEN);
    localStorage.removeItem(BrowserStorageFields.REFRESH_TOKEN);
    localStorage.removeItem(BrowserStorageFields.USER_ROLE);
    localStorage.removeItem(BrowserStorageFields.HOSPITAL_ID);
    localStorage.removeItem(BrowserStorageFields.USERNAME);
  }
}
