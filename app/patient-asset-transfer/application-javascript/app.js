/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 13:26:42
 * @modify date 2021-01-01 11:25:10
 * @desc The file which interacts with the fabric network.
 */


const {Gateway, Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, registerAndEnrollUser} = require('./CAUtil.js');
const {buildCCPHosp2, buildCCPHosp1, buildWallet} = require('./AppUtil.js');

const channelName = 'hospitalchannel';
const chaincodeName = 'patient';
const mspOrg1 = 'hosp1MSP';
const mspOrg2 = 'hosp2MSP';
const walletPath = path.join(__dirname, 'wallet');


/**
 * @author Jathin Sreenivas
 * @param  {string} doctorID
 * @return {networkObj} networkObj if all paramters are correct, the networkObj consists of contract, network, gateway
 * @return {string} response error if there is a error in the method
 * @description Connects to the network using the username - doctorID, networkObj contains the paramters using which
 * @description a connection to the fabric network is possible.
 */
exports.connectToNetwork = async function(doctorID) {
  const gateway = new Gateway();
  const ccp = buildCCPHosp1();

  try {
    const walletPath = path.join(process.cwd(), '../patient-asset-transfer/application-javascript/wallet/');

    const wallet = await buildWallet(Wallets, walletPath);

    const userExists = await wallet.get(doctorID);
    if (!userExists) {
      console.log('An identity for the doctorID: ' + doctorID + ' does not exist in the wallet');
      console.log('Create the doctorID before retrying');
      const response = {};
      response.error = 'An identity for the user ' + doctorID + ' does not exist in the wallet. Register ' + doctorID + ' first';
      return response;
    }

    /**
    * setup the gateway instance
    *  he user will now be able to create connections to the fabric network and be able to
    * ubmit transactions and query. All transactions submitted by this gateway will be
    * signed by this user using the credentials stored in the wallet.
    */
    // using asLocalhost as this gateway is using a fabric network deployed locally
    await gateway.connect(ccp, {wallet, identity: doctorID, discovery: {enabled: true, asLocalhost: true}});

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);

    const networkObj = {
      contract: contract,
      network: network,
      gateway: gateway,
    };

    return networkObj;
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    const response = {};
    response.error = error;
    return response;
  } finally {
    console.log('Succesfully connected to the network.');
    // gateway.disconnect();
  }
};


/**
 * @author Jathin Sreenivas
 * @param  {*} networkObj the object which is given when connectToNetwork is executed
 * @param  {boolean} isQuery true if retieving from ledger, else false in the case of add a transaction to the ledger.
 * @param  {string} func must be the function name in the chaincode.
 * @param  {string} args - a json string, if there are mutiple args, the args must be a json as one string
 * @return {string} response if the transaction was successful
 * @return {string} response error otherwise
 * @description A common function to interact with the ledger
 */
exports.invoke = async function(networkObj, isQuery, func, args) {
  try {
    if (isQuery === true) {
      const response = await networkObj.contract.evaluateTransaction(func, args);
      await networkObj.gateway.disconnect();
      return response;
    } else {
      if (args) {
        args = JSON.parse(args[0]);
        args = JSON.stringify(args);
      }
      const response = await networkObj.contract.submitTransaction(func, args);
      await networkObj.gateway.disconnect();
      return response;
    }
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return error;
  }
};

/**
 * @author Jathin Sreenivas
 * @param  {string} hospitalId representing the hospital to which the user/doctor has to be created
 * @param  {string} doctorId
 * @description Creates a user/doctor and adds to the wallet to the given hospital
 */
exports.registerDoctor = async function(hospitalId, doctorId) {
  if (!doctorId || !hospitalId) {
    const response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {
    const wallet = await buildWallet(Wallets, walletPath);
    if (hospitalId === 1) {
      const ccp = buildCCPHosp1();
      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hosp1.lithium.com');
      await registerAndEnrollUser(caClient, wallet, mspOrg1, doctorId, 'admin');
    } else {
      const ccp = buildCCPHosp2();
      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hosp2.lithium.com');
      await registerAndEnrollUser(caClient, wallet, mspOrg2, doctorId, 'admin');
    }
    console.log(`Successfully registered doctor . Use doctorId ${doctorId} to login above.`);
    const response = `Successfully registered doctor . Use doctorId ${doctorId} to login above.`;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${doctorId} + : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
};


/* TEMP */

exports.registerPatient = async function(networkObj, patientId, firstName, lastName, age, address) {
  try {
    console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
    console.log(`Successfully registered Patient . Use patientId ${patientId} to login above.`);
    const response = `Successfully registered Patient . Use patientId ${patientId} to login above.`;
    return response;
  } catch (error) {
    console.error(`Failed to register patient + ${patientId} + : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
};


