import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorRegisterComponent } from './doctor-register.component';

describe('DoctorNewComponent', () => {
  let component: DoctorRegisterComponent;
  let fixture: ComponentFixture<DoctorRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
