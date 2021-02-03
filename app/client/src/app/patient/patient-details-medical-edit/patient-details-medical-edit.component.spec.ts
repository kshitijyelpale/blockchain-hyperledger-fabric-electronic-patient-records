import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsMedicalEditComponent } from './patient-details-medical-edit.component';

describe('PatientDetailsMedicalEditComponent', () => {
  let component: PatientDetailsMedicalEditComponent;
  let fixture: ComponentFixture<PatientDetailsMedicalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientDetailsMedicalEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailsMedicalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
