import { Component } from '@angular/core';

import { AuthService } from './core/auth/auth.service';
import { RoleEnum } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';

  constructor(public authService: AuthService) {
  }

  public isPatient(): boolean {
    return this.authService.getRole() === RoleEnum.PATIENT;
  }

  public isDoctor(): boolean {
    return this.authService.getRole() === RoleEnum.DOCTOR;
  }

  public isAdmin(): boolean {
    return this.authService.getRole() === RoleEnum.ADMIN;
  }

  public getUsername(): string {
    return this.authService.getUsername();
  }
}
