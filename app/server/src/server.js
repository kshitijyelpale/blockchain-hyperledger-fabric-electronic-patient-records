/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 11:31:42
 * @modify date 2020-12-29 23:27:53
 * @desc NodeJS APIs to interact with the fabric network.
 * @desc Look into API docs for the documentation of the routes
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');

let network = require('../../patient-asset-transfer/application-javascript/app.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.listen(1001, () => console.log("Backend server running on 1001"));


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


/**
 * @author Jathin Sreenivas
 * @description Retrives all the patient data
 */
app.get('/patients/_all', async (req, res) => {

    let networkObj = await network.connectToNetwork('admin');
    let response = await network.invoke(networkObj, true, 'queryAllPatients');

    let parsedResponse = await JSON.parse(response);
    res.send(parsedResponse);
});

/**
 * @author Jathin Sreenivas
 * @body Doctor JSON
 * @description Register a doctor, the doctor data must be in the body and connects to the network using admin.
 * @description Adds the doctor to the wallet
 */
app.post('/registerDocter', async (req, res) => {
    
    let doctorId = req.body.doctorId;
    let hospitalId = req.body.hospitalId;

    //first create the identity for the voter and add to wallet
    let response = await network.registerDoctor(hospitalId, doctorId);
    
    if (response.error) {
        res.send(response.error);
    } else {
        console.log('Doctor registered');
        //let parsedResponse = JSON.parse(response);
        res.send(response);
    }
});


/**
 * @author Jathin Sreenivas
 * @body Patient JSON
 * @description Register a patient, the patient data must be in the body and connects to the network using admin.
 * @description Adds the patient to the ledger via the patient chaincode
 */
app.post('/patients/register', async (req, res) => {
    
    // TODO: take admin id instead of doctor
    let networkObj = await network.connectToNetwork('admin');
    //delete req.body['doctorId'];

    //req.body = JSON.stringify(req.body);
    //let args = [req.body];
    //let response = await network.invoke(networkObj, false, 'createPatient', args);

    let response = await network.registerPatient(networkObj, req.body.patientId, req.body.firstName, req.body.lastName, req.body.age, req.body.address);
    if (response.error) {
      res.send(response.error);
    } else {
      res.send(response);
    }
    
});

/**
 * @author Jathin Sreenivas 
 * @query patientID
 * @body JSON consisting of doctorId representing which doctor is trying to get the data
 * @description Retrives the patient object for the patientID. Connects to the network using DoctorID in body.
 */
app.get('/patients/:patientId', async (req, res) => {

    let patientId = req.params.patientId;
    let doctorId = req.body.doctorId;

    let networkObj = await network.connectToNetwork(doctorId);

    let response = await network.invoke(networkObj, true, 'readPatient', patientId);
    if (response.error) {
        res.send(response.error);
    } else {
        res.send(response);
    }
});
