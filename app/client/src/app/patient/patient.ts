export interface PatientRecord {
  patientId: string;
  firstName: string;
  lastName: string;
  // address: string;
  // age: number;
  // allergies: boolean;
  // diagnosis: string;
  // docType: string;
  emergPhoneNumber: string;
  // followUp: string;
  phoneNumber: string;
  // symptoms: string;
  // treatment: string;
}

/*export interface ResRecord {
  Key: string;
  Record: PatientRecord;
}*/

export class PatientViewRecord {
  patientId = '';
  firstName = '';
  lastName = '';
  // address = '';
  // age = 0;
  // allergies = false;
  // diagnosis = '';
  // docType = '';
  emergPhoneNumber = '';
  // followUp = '';
  phoneNumber = '';
  // symptoms = '';
  // treatment = '';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    // this.address = patientRecord.address;
    // this.age = patientRecord.age;
    // this.allergies = patientRecord.allergies;
    // this.docType = patientRecord.docType;
    this.emergPhoneNumber = patientRecord.emergPhoneNumber;
    // this.followUp = patientRecord.followUp;
    this.phoneNumber = patientRecord.phoneNumber;
    // this.symptoms = patientRecord.symptoms;
    // this.treatment = patientRecord.treatment;
  }
}

export class DisplayVal {
  keyName: string;
  displayName: string;

  constructor(key: string, value: string) {
    this.keyName = key;
    this.displayName = value;
  }
}
