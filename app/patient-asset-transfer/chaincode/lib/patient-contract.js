/**
 * @author Varsha Kamath
 * @email varsha.kamath@stud.fra-uas.de
 * @create date 2020-12-14 21:50:38
 * @modify date 2021-01-19 22:30:00
 * @desc [Smartcontract to create, read, update and delete patient details in legder]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
let Patient = require('./Patient.js');
var crypto = require('crypto');

class PatientContract extends Contract {

    async patientExists(ctx, patientId) {
        const buffer = await ctx.stub.getState(patientId);
        return (!!buffer && buffer.length > 0);
    }

    async readPatient(ctx, patientId) {
        const exists = await this.patientExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient ${patientId} does not exist`);
        }
        const buffer = await ctx.stub.getState(patientId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    //This function is to update patient personal details. This function should be called by patient.
    async updatePatientPersonalDetails(ctx, args) {
        args = JSON.parse(args);
        let patientId = args.patientId;
        let newPhoneNumber = args.newPhoneNumber;
        let newEmergPhoneNumber = args.newEmergPhoneNumber;
        let newAddress = args.newAddress;
        let newAllergies = args.newAllergies;

        const patient = await this.readPatient(ctx, patientId)
        if (newPhoneNumber !== null && newPhoneNumber !== '')
            patient.phoneNumber = newPhoneNumber;

        if (newEmergPhoneNumber !== null && newEmergPhoneNumber !== '')
            patient.emergPhoneNumber = newEmergPhoneNumber;

        if (newAddress !== null && newAddress !== '')
            patient.address = newAddress;

        if (newAllergies !== null && newAllergies !== '')
            patient.allergies = newAllergies;

        const buffer = Buffer.from(JSON.stringify(patient));
        await ctx.stub.putState(patientId, buffer);
    }

    //This function is to update patient password. This function should be called by patient.
    async updatePatientPassword(ctx, args) {
        args = JSON.parse(args);
        let patientId = args.patientId;
        let newPassword = args.newPassword;

        if (newPassword !== null && newPassword !== '') {
            const patient = await this.readPatient(ctx, patientId);
            patient.password = crypto.createHash('sha256').update(newPassword).digest('hex');
            const buffer = Buffer.from(JSON.stringify(patient));
            await ctx.stub.putState(patientId, buffer);
        }
        else
            throw new Error(`Empty or null values should not be passed for newPassword parameter`);
    }

    //Returns the patient's password
    async getPatientPassword(ctx, patientId) {
        const patient = await this.readPatient(ctx, patientId);
        const password = patient.password;
        return password;
    }

    //Retrieves patient medical history based on patientId
    async getPatientHistory(ctx, patientId) {
        let resultsIterator = await ctx.stub.getHistoryForKey(patientId);
        let results = await this.getAllPatientResults(resultsIterator, true);
        console.info('results <--> ', results);
        return JSON.stringify(results);
    }

    async getAllPatientResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }
}
module.exports = PatientContract;