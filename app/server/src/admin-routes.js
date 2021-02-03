/* eslint-disable new-cap */
/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2021-01-27 12:47:10
 * @modify date 2021-02-03 18:01:29
 * @desc Admin specific methods - API documentation in http://localhost:3002/ swagger editor.
 */

// Bring common classes into scope, and Fabric SDK network class
const {ROLE_ADMIN, ROLE_DOCTOR, capitalize, getMessage, validateRole, createRedisClient} = require('../utils.js');
const network = require('../../patient-asset-transfer/application-javascript/app.js');

/**
 * @param  {Request} req Body must be a patient json and role in the header
 * @param  {Response} res 201 response if asset is created else 400 with a simple json message
 * @description Creates a patient as an user adds the patient to the wallet and an asset(patient) is added to the ledger
 */
exports.createPatient = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_ADMIN], userRole, res);
  // Set up and connect to Fabric Gateway using the session user
  const networkObj = await network.connectToNetwork(req.session.USERNAME);
  // Enrol and register the user with the CA and adds the user to the wallet.
  let response = await network.registerUser(req.body.hospitalId, req.body.patientId);
  if (response.error) {
    res.send(response.error);
  }
  // The request present in the body is converted into a single json string
  req.body = JSON.stringify(req.body);
  const args = [req.body];
  // Invoke the smart contract function
  response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:createPatient', args);
  (response.error) ? res.status(400).send(response.error) : res.status(201).send(getMessage(false, 'Successfully registered Patient.'));
};

/**
 * @param  {Request} req Body must be a doctor json and role in the header
 * @param  {Response} res 201 response if asset is created else 400 with a simple json message
 * @description Creates a doctor as an user adds the doctor to the wallet
 */
exports.createDoctor = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const {userId, hospitalId, password} = req.body;
  await validateRole([ROLE_ADMIN], userRole, res);
  req.body = JSON.stringify(req.body);
  const args = [req.body];
  // Create a redis client and add the doctor to redis
  const redisClient = createRedisClient(hospitalId);
  (await redisClient).SET(userId, password);
  // Enrol and register the user with the CA and adds the user to the wallet.
  const response = await network.registerUser(args);
  (response.error) ? res.status(400).send(response.error) : res.status(201).send(getMessage(false, response));
};

/**
 * @param  {Request} req Role in the header
 * @param  {Response} res 200 response with the json of all the assets(patients) in the ledger
 * @description Retrieves all the assets(patients) in the ledger
 */
exports.getAllPatients = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_ADMIN, ROLE_DOCTOR], userRole, res);
  // Set up and connect to Fabric Gateway using the session user
  const networkObj = await network.connectToNetwork(req.session.USERNAME);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:queryAllPatients', '');
  const parsedResponse = await JSON.parse(response);
  res.status(200).send(parsedResponse);
};
