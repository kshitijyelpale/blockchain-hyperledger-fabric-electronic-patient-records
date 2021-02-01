import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PatientComponent } from './patient/patient.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './core/auth/auth.guard';
import { PatientRegisterComponent } from './patient/patient-register/patient-register.component';
import { DoctorRegisterComponent } from './doctor/doctor-register/doctor-register.component';
import { PatientHistoryComponent } from './patient/patient-history/patient-history.component';
import { PatientDetailsMedicalEditComponent } from './patient/patient-details-medical-edit/patient-details-medical-edit.component';
import { PatientDetailsPersonalEditComponent } from './patient/patient-details-personal-edit/patient-details-personal-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'patient/register',
    component: PatientRegisterComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'patient/:patientId/details/personal/edit',
    component: PatientDetailsPersonalEditComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'patient/:patientId/details/medical/edit',
    component: PatientDetailsMedicalEditComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'patient/:patientId',
    component: PatientComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'patient/:patientId/history',
    component: PatientHistoryComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'doctor/register',
    component: DoctorRegisterComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'doctor/:doctorId',
    component: DoctorComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'admin',
    component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
