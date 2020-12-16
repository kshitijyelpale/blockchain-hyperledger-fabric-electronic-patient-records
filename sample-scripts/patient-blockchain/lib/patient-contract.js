/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

//This statement is used to import the features from 'fabric-contract-api'
const { Contract } = require('fabric-contract-api');

class PatientContract extends Contract {

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
        const patient = { address: newAddress };
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

}

module.exports = PatientContract;
