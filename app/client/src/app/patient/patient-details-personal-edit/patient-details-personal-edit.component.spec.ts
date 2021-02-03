import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsPersonalEditComponent } from './patient-details-personal-edit.component';

describe('PatientDetailsPersonalEditComponent', () => {
  let component: PatientDetailsPersonalEditComponent;
  let fixture: ComponentFixture<PatientDetailsPersonalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientDetailsPersonalEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailsPersonalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
