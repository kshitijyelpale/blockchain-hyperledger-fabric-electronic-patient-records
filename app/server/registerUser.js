/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 13:26:42
 * @modify date 2020-12-31 14:45:51
 * @desc This file creates a user named 'appUser' at Hospital 1. (Just for testing. Use the API to create a patient)
 */


const {Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, registerAndEnrollUser} = require('../patient-asset-transfer/application-javascript/CAUtil.js');
const walletPath = path.join(__dirname, 'wallet');
const {buildCCPHosp1, buildWallet} = require('../patient-asset-transfer/application-javascript/AppUtil.js');
const mspOrg1 = 'hosp1MSP';
const hosp1UserId = 'appUser';
const adminHospital1 = 'adminHosp1';

/**
 */
async function main() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPHosp1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hosp1.lithium.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // enrolls users to Hospital 1 and adds the user to the wallter
    await registerAndEnrollUser(caClient, wallet, mspOrg1, hosp1UserId, adminHospital1);

    console.log('msg: Successfully enrolled user ' + hosp1UserId + ' and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to register user "${hosp1UserId}": ${error}`);
    process.exit(1);
  }
}

main();
