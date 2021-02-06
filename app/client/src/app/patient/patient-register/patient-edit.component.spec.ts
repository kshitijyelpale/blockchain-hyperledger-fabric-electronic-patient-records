import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEditComponent } from './patient-edit.component';

describe('PatientNewComponent', () => {
  let component: PatientEditComponent;
  let fixture: ComponentFixture<PatientEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
