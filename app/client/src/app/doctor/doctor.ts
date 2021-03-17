export interface DoctorRecord {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export class DoctorViewRecord {
  doctorId = '';
  firstName = '';
  lastName = '';
  speciality = '';
  role = '';

  constructor(readonly doctorRecord: DoctorRecord) {
    this.doctorId = doctorRecord.id;
    this.firstName = doctorRecord.firstName;
    this.lastName = doctorRecord.lastName;
    this.role = doctorRecord.role;
  }
}
