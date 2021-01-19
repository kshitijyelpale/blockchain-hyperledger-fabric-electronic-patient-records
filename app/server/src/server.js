/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 11:31:42
 * @modify date 2021-01-19 16:24:31
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

app.listen(3001, () => console.log('Backend server running on 3001'));


const getMessage = (isError, message) => {
  if (isError) {
    return {error: message};
  } else {
    return {success: message};
  }
};

app.post('/login', async (req, res) => {
  // Read username and password from request body
  const {username, password} = req.body;

  // Filter user from the users array by username and password
  const user = username === 'hosp1admin' && password === 'hosp1lithium';

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign({username: 'hosp1admin', role: 'admin'}, 'hosp1lithium');
    res.status(200);
    res.json({
      accessToken,
    });
  } else {
    res.status(400).send({error: 'Username or password incorrect!'});
  }
});

const validateRole = (roles, reqRole, res) => {
  roles = roles.split('|');
  if (reqRole.length === 0 || roles.length === 0 || !roles.includes(reqRole)) {
    // user's role is not authorized
    return res.sendStatus(401).json({message: 'Unauthorized'});
  }
};

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'hosp1lithium', (err, user) => {
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
  const userRole = req.headers.role;
  await validateRole('doctor|admin', userRole, res);
  const networkObj = await network.connectToNetwork('hosp1admin');
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:queryAllPatients', '');
  const parsedResponse = await JSON.parse(response);
  res.status(200).send(parsedResponse);
});

/**
 * @author Jathin Sreenivas
 * @body Doctor JSON
 * @description Register a doctor, the doctor data must be in the body and connects to the network using admin.
 * @description Adds the doctor to the wallet
 */
app.post('/doctors/register', authenticateJWT, async (req, res) => {
  const userRole = req.headers.role;
  await validateRole('admin', userRole, res);
  const doctorId = req.body.doctorId;
  const hospitalId = req.body.hospitalId;
  // const userPasswd = req.body.userPasswd;

  // first create the identity for the voter and add to wallet
  const response = await network.registerUser(hospitalId, doctorId);

  (response.error) ? res.status(400).send(response.error) : res.status(201).send(getMessage(false, response));
});


/**
 * @author Jathin Sreenivas
 * @body Patient JSON
 * @description Register a patient, the patient data must be in the body and connects to the network using admin.
 * @description Adds the patient to the ledger via the patient chaincode.
 */
app.post('/patients/register', authenticateJWT, async (req, res) => {
  const userRole = req.headers.role;
  await validateRole('admin', userRole, res);
  // TODO: take admin id instead of doctor
  const networkObj = await network.connectToNetwork('hosp1admin');
  // delete req.body['doctorId'];
  let response = await network.registerUser(req.body.hospitalId, req.body.patientId);
  if (response.error) {
    res.send(response.error);
  }
  req.body = JSON.stringify(req.body);
  const args = [req.body];
  response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:createPatient', args);
  (response.error) ? res.status(400).send(response.error) : res.status(201).send(getMessage(false, 'Successfully registered Patient.'));
});

/**
 * @author Jathin Sreenivas
 * @query patientID
 * @body JSON consisting of doctorId representing which doctor is trying to get the data
 * @description Retrives the patient object for the patientID. Connects to the network using DoctorID in body.
 */
app.get('/patients/:patientId', authenticateJWT, async (req, res) => {
  const userRole = req.headers.role;
  await validateRole('patient|doctor', userRole, res);
  const patientId = req.params.patientId;

  const networkObj = await network.connectToNetwork('hosp1admin');

  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:readPatient', patientId);

  (response.error) ? res.status(400).send(response.error) : res.status(200).send(JSON.parse(response));
});

/**
 * @author Jathin Sreenivas
 * @query patientID
 * @body JSON consisting of patient's medical details
 * @description Updates the patient medical details, to be used only by doctors.
 */
app.patch('/patients/:patientId/details/medical', authenticateJWT, async (req, res) => {
  const userRole = req.headers.role;
  await validateRole('doctor', userRole, res);
  let args = req.body;
  args.patientId = req.params.patientId;
  args= [JSON.stringify(args)];

  // TODO: Connect to network using patientID from req auth. Dependency external DB
  const networkObj = await network.connectToNetwork('hosp1admin');
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:updatePatientMedicalDetails', args);

  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Updated Patient.'));
});


/**
 * @author Jathin Sreenivas
 * @query patientID
 * @body JSON consisting of patient's personal details
 * @description Updates the patient personal details, to be used only by patient themselves.
 */
app.patch('/patients/:patientId/details/personal', authenticateJWT, async (req, res) => {
  const userRole = req.headers.role;
  await validateRole('patient', userRole, res);
  let args = req.body;
  args.patientId = req.params.patientId;
  args= [JSON.stringify(args)];

  // TODO: Connect to network using patientID from req auth. Dependency external DB
  const networkObj = await network.connectToNetwork('hosp1admin');
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:updatePatientPersonalDetails', args);

  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Updated Patient.'));
});


/**
 * @author Jathin Sreenivas
 * @query patientID
 * @body JSON consisting of patient's personal details
 * @description Updates the patient personal details, to be used only by patient themselves.
 */
app.get('/patients/:patientId/history', authenticateJWT, async (req, res) => {
  const userRole = req.headers.role;
  await validateRole('patient|doctor', userRole, res);
  const patientId = req.params.patientId;

  // TODO: Connect to network using patientID from req auth. Dependency external DB
  const networkObj = await network.connectToNetwork('hosp1admin');
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:getPatientHistory', patientId);

  const parsedResponse = await JSON.parse(response);
  (response.error) ? res.status(400).send(response.error) : res.status(200).send(parsedResponse);
});


