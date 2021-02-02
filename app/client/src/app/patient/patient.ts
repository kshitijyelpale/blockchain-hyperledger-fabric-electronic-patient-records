export interface Timestamp {
  nanos: number;
  seconds: ISeconds;
}

export interface ISeconds {
  high: number;
  low: number;
  unsigned: boolean;
}

export interface PatientRecord {
  patientId: string;
  firstName: string;
  lastName: string;
  address: string;
  age: number;
  emergPhoneNumber: string;
  phoneNumber: string;
  bloodGroup: string;
  allergies: boolean;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  followUp: string;
  docType: string;
  timestamp: Timestamp;
}

/*export interface ResRecord {
  Key: string;
  Record: PatientRecord;
}*/

export class PatientViewRecord {
  patientId = '';
  firstName = '';
  lastName = '';
  address = '';
  age = 0;
  emergPhoneNumber = '';
  phoneNumber = '';
  bloodGroup = '';
  allergies = false;
  symptoms = '';
  diagnosis = '';
  treatment = '';
  followUp = '';
  docType = '';
  date = '';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    this.address = patientRecord.address;
    this.age = patientRecord.age;
    this.emergPhoneNumber = patientRecord.emergPhoneNumber;
    this.phoneNumber = patientRecord.phoneNumber;
    this.bloodGroup = patientRecord.bloodGroup;
    this.allergies = patientRecord.allergies;
    this.symptoms = patientRecord.symptoms;
    this.diagnosis = patientRecord.diagnosis;
    this.treatment = patientRecord.treatment;
    this.followUp = patientRecord.followUp;
    this.docType = patientRecord.docType;
    this.date = new Date(patientRecord.timestamp.seconds.low).toDateString();
  }
}

export class PatientAdminViewRecord {
  patientId = '';
  firstName = '';
  lastName = '';
  docType = '';
  emergPhoneNumber = '';
  phoneNumber = '';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    this.docType = patientRecord.docType;
    this.emergPhoneNumber = patientRecord.emergPhoneNumber;
    this.phoneNumber = patientRecord.phoneNumber;
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
