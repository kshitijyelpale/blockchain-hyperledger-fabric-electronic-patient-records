/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class PatientContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const patient = [
            {
                firstName: 'Patient1',
                lastName: 'test1',
                age: '21',
                address: 'Frankfurt',
            },
            {
                firstName: 'patient2',
                lastName: 'test2',
                age: '25',
                address: 'Frankfurt',
            },
        ];

        for (let i = 0; i < patient.length; i++) {
            patient[i].docType = 'patient';
            await ctx.stub.putState('PATIENT' + i, Buffer.from(JSON.stringify(patient[i])));
            console.info('Added <--> ', patient[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async patientExists(ctx, patientId) {
        const buffer = await ctx.stub.getState(patientId);
        return (!!buffer && buffer.length > 0);
    }

    async createPatient(ctx, patientId, firstName, lastName, age, address) {
        const exists = await this.patientExists(ctx, patientId);
        if (exists) {
            throw new Error(`The patient ${patientId} already exists`);
        }
        const patient = {
            firstName,
            lastName,
            docType: 'patient',
            age,
            address,
        };
        const buffer = Buffer.from(JSON.stringify(patient));
        await ctx.stub.putState(patientId, buffer);
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

    async updatePatient(ctx, patientId, newAddress) {
        const exists = await this.patientExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient ${patientId} does not exist`);
        }
        const patient = await this.readPatient(ctx, patientId)
        patient.address = newAddress;
        const buffer = Buffer.from(JSON.stringify(patient));
        await ctx.stub.putState(patientId, buffer);
    }

    async deletePatient(ctx, patientId) {
        const exists = await this.patientExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient ${patientId} does not exist`);
        }
        await ctx.stub.deleteState(patientId);
    }

    async queryAllPatients(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }


}

module.exports = PatientContract;
