/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const PrimaryContract = require('./lib/primary-contract.js');
const AdminContract = require('./lib/admin-contract.js');
const PatientContract = require('./lib/patient-contract.js');
const DoctorContract = require('./lib/doctor-contract.js');

module.exports.contracts = [ PrimaryContract, AdminContract, DoctorContract, PatientContract ];
