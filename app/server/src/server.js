/* eslint-disable new-cap */
/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 11:31:42
 * @modify date 2021-02-04 16:39:05
 * @desc NodeJS APIs to interact with the fabric network.
 * @desc Look into API docs for the documentation of the routes
 */


// Classes for Node Express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const jwtSecretToken = 'password';
// const https = require('https');
// const fs = require('fs');
// const path = require('path');

// Express Application init
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.listen(3001, () => console.log('Backend server running on 3001'));

// Bring key classes into scope
const patientRoutes = require('./patient-routes');
const doctorRoutes = require('./doctor-routes');
const adminRoutes = require('./admin-routes');
const {ROLE_DOCTOR, ROLE_ADMIN, ROLE_PATIENT, createRedisClient} = require('../utils');

// TODO: We can start the server with https so encryption will be done for the data transferred ove the network
// TODO: followed this link https://timonweb.com/javascript/running-expressjs-server-over-https/ to create certificate and added in the code
/* https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert')),
}, app)
  .listen(3001, function() {
    console.log('Backend server running on 3001! Go to https://localhost:3001/');
  });*/


const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token === '' || token === 'null') {
      return res.status(401).send('Unauthorized request');
    }
    jwt.verify(token, jwtSecretToken, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).send('Unauthorized request');
  }
};
/**
 * @description Login and create a session with and add two variables to the session
 */
app.post('/login', async (req, res) => {
  // Read username and password from request body
  const {username, password, hospitalId} = req.body;
  let user;
  // using get instead of redis GET for async
  if (req.headers.role === ROLE_DOCTOR || req.headers.role === ROLE_ADMIN) {
    // Create a redis client based on the hospital ID
    const redisClient = await createRedisClient(hospitalId);
    // Async get
    const value = await redisClient.get(username);
    // comparing passwords
    user = value === password;
    redisClient.quit();
  }
  if (req.headers.role === ROLE_PATIENT) {

  }

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign({username: username, role: req.params.role}, jwtSecretToken);
    // Once the password is matched a session is created with the username and password
    res.status(200);
    res.json({
      accessToken,
    });
  } else {
    res.status(400).send({error: 'Username or password incorrect!'});
  }
});


// //////////////////////////////// Admin Routes //////////////////////////////////////
app.post('/doctors/register', authenticateJWT, adminRoutes.createDoctor);
app.get('/patients/_all', authenticateJWT, adminRoutes.getAllPatients);
app.post('/patients/register', authenticateJWT, adminRoutes.createPatient);

// //////////////////////////////// Doctor Routes //////////////////////////////////////
app.patch('/patients/:patientId/details/medical', authenticateJWT, doctorRoutes.updatePatientMedicalDetails);

// //////////////////////////////// Patient Routes //////////////////////////////////////
app.get('/patients/:patientId', authenticateJWT, patientRoutes.getPatientById);
app.patch('/patients/:patientId/details/personal', authenticateJWT, patientRoutes.updatePatientPersonalDetails);
app.get('/patients/:patientId/history', authenticateJWT, patientRoutes.getPatientHistoryById);
app.get('/doctors/:hospitalId/_all', authenticateJWT, patientRoutes.getDoctorsByHospitalId);
app.patch('/patients/:patientId/grant/:doctorId', patientRoutes.grantAccessToDoctor);
app.patch('/patients/:patientId/revoke/:doctorId', patientRoutes.revokeAccessFromDoctor);
