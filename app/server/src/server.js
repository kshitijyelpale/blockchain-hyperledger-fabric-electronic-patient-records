/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 11:31:42
 * @modify date 2020-12-31 14:51:40
 * @desc NodeJS APIs to interact with the fabric network.
 * @desc Look into API docs for the documentation of the routes
 */


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');


const network = require('../../patient-asset-transfer/application-javascript/app.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.listen(1001, () => console.log('Backend server running on 1001'));


app.post('/login', async (req, res) => {
  // Read username and password from request body
  const {username, password} = req.body;

  // Filter user from the users array by username and password
  const user = username === 'admin' && password === 'adminpw';

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign({username: 'admin', role: 'admin'}, 'adminpw');
    res.json({
      accessToken,
    });
  } else {
    res.send('Username or password incorrect');
  }
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'adminpw', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

/**
 * @author Jathin Sreenivas
 * @description Retrives all the patient data
 */
app.get('/patients/_all', async (req, res) => {
  const networkObj = await network.connectToNetwork('admin');
  const response = await network.invoke(networkObj, true, 'queryAllPatients');

  const parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);
});

/**
 * @author Jathin Sreenivas
 * @body Doctor JSON
 * @description Register a doctor, the doctor data must be in the body and connects to the network using admin.
 * @description Adds the doctor to the wallet
 */
app.post('/registerDocter', authenticateJWT, async (req, res) => {
  const doctorId = req.body.doctorId;
  const hospitalId = req.body.hospitalId;

  // first create the identity for the voter and add to wallet
  const response = await network.registerDoctor(hospitalId, doctorId);

  if (response.error) {
    res.send(response.error);
  } else {
    console.log('Doctor registered');
    // let parsedResponse = JSON.parse(response);
    res.send(response);
  }
});


/**
 * @author Jathin Sreenivas
 * @body Patient JSON
 * @description Register a patient, the patient data must be in the body and connects to the network using admin.
 * @description Adds the patient to the ledger via the patient chaincode
 */
app.post('/patients/register', authenticateJWT, async (req, res) => {
  // TODO: take admin id instead of doctor
  const networkObj = await network.connectToNetwork('admin');
  // delete req.body['doctorId'];

  // req.body = JSON.stringify(req.body);
  // let args = [req.body];
  // let response = await network.invoke(networkObj, false, 'createPatient', args);

  const response = await network.registerPatient(networkObj, req.body.patientId, req.body.firstName,
    req.body.lastName, req.body.age, req.body.address);
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
app.get('/patients/:patientId', authenticateJWT, async (req, res) => {
  const patientId = req.params.patientId;
  const doctorId = req.body.doctorId;

  const networkObj = await network.connectToNetwork(doctorId);

  const response = await network.invoke(networkObj, true, 'readPatient', patientId);
  if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});
