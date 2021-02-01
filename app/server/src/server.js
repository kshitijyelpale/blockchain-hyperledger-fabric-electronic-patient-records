/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 11:31:42
 * @modify date 2021-01-27 16:07:24
 * @desc NodeJS APIs to interact with the fabric network.
 * @desc Look into API docs for the documentation of the routes
 */


// Classes for Node Express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
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

// TODO: We can start the server with https so encryption will be done for the data transferred ove the network
// TODO: followed this link https://timonweb.com/javascript/running-expressjs-server-over-https/ to create certificate and added in the code
/* https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert')),
}, app)
  .listen(3001, function() {
    console.log('Backend server running on 3001! Go to https://localhost:3001/');
  });*/

// TODO: to move to utils.
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token === '' || token === 'null') {
      return res.status(401).send('Unauthorized request');
    }

    jwt.verify(token, 'hosp1lithium', (err, user) => {
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

// TODO: Login to be changed to login/patient and login/doctor
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

// //////////////////////////////// Admin Routes //////////////////////////////////////
app.post('/doctors/register', authenticateJWT, adminRoutes.createDoctor);
app.get('/patients/_all', adminRoutes.getAllPatients);
app.post('/patients/register', authenticateJWT, adminRoutes.createPatient);

// //////////////////////////////// Doctor Routes //////////////////////////////////////
app.patch('/patients/:patientId/details/medical', authenticateJWT, doctorRoutes.updatePatientMedicalDetails);

// //////////////////////////////// Patient Routes //////////////////////////////////////
app.get('/patients/:patientId', authenticateJWT, patientRoutes.getPatientById);
app.patch('/patients/:patientId/details/personal', authenticateJWT, patientRoutes.updatePatientPersonalDetails);
app.get('/patients/:patientId/history', authenticateJWT, patientRoutes.getPatientHistoryById);
