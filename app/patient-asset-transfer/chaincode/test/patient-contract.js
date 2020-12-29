/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { PatientContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('PatientContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new PatientContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"patient 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"patient 1002 value"}'));
    });

    describe('#patientExists', () => {

        it('should return true for a patient', async () => {
            await contract.patientExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a patient that does not exist', async () => {
            await contract.patientExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createPatient', () => {

        it('should create a patient', async () => {
            await contract.createPatient(ctx, '1003', 'patient 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"patient 1003 value"}'));
        });

        it('should throw an error for a patient that already exists', async () => {
            await contract.createPatient(ctx, '1001', 'myvalue').should.be.rejectedWith(/The patient 1001 already exists/);
        });

    });

    describe('#readPatient', () => {

        it('should return a patient', async () => {
            await contract.readPatient(ctx, '1001').should.eventually.deep.equal({ value: 'patient 1001 value' });
        });

        it('should throw an error for a patient that does not exist', async () => {
            await contract.readPatient(ctx, '1003').should.be.rejectedWith(/The patient 1003 does not exist/);
        });

    });

    describe('#updatePatient', () => {

        it('should update a patient', async () => {
            await contract.updatePatient(ctx, '1001', 'patient 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"patient 1001 new value"}'));
        });

        it('should throw an error for a patient that does not exist', async () => {
            await contract.updatePatient(ctx, '1003', 'patient 1003 new value').should.be.rejectedWith(/The patient 1003 does not exist/);
        });

    });

    describe('#deletePatient', () => {

        it('should delete a patient', async () => {
            await contract.deletePatient(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a patient that does not exist', async () => {
            await contract.deletePatient(ctx, '1003').should.be.rejectedWith(/The patient 1003 does not exist/);
        });

    });

});