/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const PatientContract = require('./lib/patient-contract.js');
const DoctorContract = require('./lib/doctor-contract.js');

//module.exports.PatientContract = PatientContract;
//module.exports.DoctorContract = DoctorContract;
module.exports.contracts = [ DoctorContract, PatientContract ];
