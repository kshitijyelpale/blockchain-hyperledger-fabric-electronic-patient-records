import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { PatientComponent } from './patient/patient.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AuthService } from './core/auth/auth.service';
import { AuthGuard } from './core/auth/auth.guard';
import { TokenInterceptorService } from './core/auth/token-interceptor.service';
import { ToolbarButtonComponent, ToolbarLinkComponent, ToolbarComponent } from './sidebar';
import { SearchComboComponent, SearchService, SearchTextComponent } from './search';
import { AdminService } from './admin/admin.service';
import { PatientService } from './patient/patient.service';
import { DoctorService } from './doctor/doctor.service';
import { PatientRegisterComponent } from './patient/patient-register/patient-register.component';
import { DoctorRegisterComponent } from './doctor/doctor-register/doctor-register.component';
import { PatientHistoryComponent } from './patient/patient-history/patient-history.component';
import { PatientDetailsMedicalEditComponent } from './patient/patient-details-medical-edit/patient-details-medical-edit.component';
import { PatientDetailsPersonalEditComponent } from './patient/patient-details-personal-edit/patient-details-personal-edit.component';
import { DoctorListForPatientComponent } from './doctor/doctor-list-for-patient/doctor-list-for-patient.component';

const components = [
  AppComponent,
  LoginComponent,
  AdminComponent,
  PatientComponent,
  PatientRegisterComponent,
  PatientHistoryComponent,
  PatientDetailsMedicalEditComponent,
  PatientDetailsPersonalEditComponent,
  DoctorListForPatientComponent,
  DoctorComponent,
  DoctorRegisterComponent,
  ToolbarComponent,
  ToolbarButtonComponent,
  ToolbarLinkComponent,
  SearchComboComponent,
  SearchTextComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ AuthService, AuthGuard, SearchService, AdminService, PatientService, DoctorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
