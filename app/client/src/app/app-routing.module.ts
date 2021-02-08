import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PatientComponent } from './patient/patient.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './core/auth/auth.guard';
import { PatientEditComponent } from './patient/patient-register/patient-edit.component';
import { DoctorRegisterComponent } from './doctor/doctor-register/doctor-register.component';
import { PatientHistoryComponent } from './patient/patient-history/patient-history.component';
import { PatientDetailsMedicalEditComponent } from './patient/patient-details-medical-edit/patient-details-medical-edit.component';
import { PatientDetailsPersonalEditComponent } from './patient/patient-details-personal-edit/patient-details-personal-edit.component';
import { DoctorListForPatientComponent } from './doctor/doctor-list-for-patient/doctor-list-for-patient.component';
import { PatientListForDoctorComponent } from './doctor/patient-list-for-doctor/patient-list-for-doctor.component';

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
    path: 'patient/edit/:self',
    component: PatientEditComponent,
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
    path: 'patient/:patientId/doctors/list',
    component: DoctorListForPatientComponent,
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
    path: 'doctor/:doctorId/patients',
    component: PatientListForDoctorComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'admin/:adminId',
    component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
