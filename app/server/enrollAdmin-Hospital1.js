/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 13:26:42
 * @modify date 2021-01-30 12:21:44
 * @desc Execute this file to create and enroll an admin at Hospital 1.
 */


const {Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, enrollAdmin} = require('../patient-asset-transfer/application-javascript/CAUtil.js');
const {buildCCPHosp1, buildWallet} = require('../patient-asset-transfer/application-javascript/AppUtil.js');
const adminHospital1 = 'hosp1admin';
const adminHospital1Passwd = 'hosp1lithium';

const mspHosp1 = 'hosp1MSP';
const walletPath = path.join(__dirname, '../patient-asset-transfer/application-javascript/wallet');

// Temporary DB
// const {addUser} = require('./Hosp1LocalDB.js');

/**
 * @description This functions enrolls the admin of Hospital 1
 */
exports.enrollAdminHosp1 = async function() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPHosp1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hosp1.lithium.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // to be executed and only once per hospital. Which enrolls admin and creates admin in the wallet
    await enrollAdmin(caClient, wallet, mspHosp1, adminHospital1, adminHospital1Passwd);

    console.log('msg: Successfully enrolled admin user ' + adminHospital1 + ' and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user ' + ${adminHospital1} + : ${error}`);
    process.exit(1);
  }
};
