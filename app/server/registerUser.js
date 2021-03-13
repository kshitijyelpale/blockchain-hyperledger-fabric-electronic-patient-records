/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 13:26:42
 * @modify date 2021-03-13 15:04:01
 * @desc This file creates a user named 'appUser' at Hospital 1. (Just for testing. Use the API to create a patient)
 */


const {Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, registerAndEnrollUser} = require('../patient-asset-transfer/application-javascript/CAUtil.js');
const walletPath = path.join(__dirname, '/../patient-asset-transfer/application-javascript/wallet');
const {buildCCPHosp1, buildCCPHosp2, buildWallet, buildCCPHosp3} = require('../patient-asset-transfer/application-javascript/AppUtil.js');
let mspOrg;
let adminUserId;
let caClient;

/**
 * @param {String} hospitalId
 * @param {string} userId
 * @param {String} attributes
 */
exports.enrollRegisterUser = async function(hospitalId, userId, attributes) {
  try {
    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);
    hospitalId = parseInt(hospitalId);

    if (hospitalId === 1) {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPHosp1();

      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      caClient = buildCAClient(FabricCAServices, ccp, 'ca.hosp1.lithium.com');

      mspOrg = 'hosp1MSP';
      adminUserId = 'hosp1admin';
    } else if (hospitalId === 2) {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPHosp2();

      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      caClient = buildCAClient(FabricCAServices, ccp, 'ca.hosp2.lithium.com');

      mspOrg = 'hosp2MSP';
      adminUserId = 'hosp2admin';
    } else if (hospitalId === 3) {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPHosp3();

      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      caClient = buildCAClient(FabricCAServices, ccp, 'ca.hosp3.lithium.com');

      mspOrg = 'hosp3MSP';
      adminUserId = 'hosp3admin';
    }
    // enrolls users to Hospital 1 and adds the user to the wallet
    await registerAndEnrollUser(caClient, wallet, mspOrg, userId, adminUserId, attributes);
    console.log('msg: Successfully enrolled user ' + userId + ' and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to register user "${userId}": ${error}`);
    process.exit(1);
  }
};
