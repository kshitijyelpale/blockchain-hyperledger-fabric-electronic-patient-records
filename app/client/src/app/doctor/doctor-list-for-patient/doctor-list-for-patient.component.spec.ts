import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorListForPatientComponent } from './doctor-list-for-patient.component';

describe('DoctorListForPatientComponent', () => {
  let component: DoctorListForPatientComponent;
  let fixture: ComponentFixture<DoctorListForPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorListForPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorListForPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
