import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientListForDoctorComponent } from './patient-list-for-doctor.component';

describe('PatientListForDoctorComponent', () => {
  let component: PatientListForDoctorComponent;
  let fixture: ComponentFixture<PatientListForDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientListForDoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientListForDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
