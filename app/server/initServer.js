const path = require('path');
const fs = require('fs');

const {enrollAdminHosp1} = require('./enrollAdmin-Hospital1');
const {enrollAdminHosp2} = require('./enrollAdmin-Hospital2');
const {enrollRegisterUser} = require('./registerUser');


/**
 * @description Enrolls and registers the patients in the initLedger as users.
 */
async function initLedger() {
  try {
    const jsonString = fs.readFileSync('../patient-asset-transfer/chaincode/lib/initLedger.json');
    const patients = JSON.parse(jsonString);
    let i = 0;
    for (i = 0; i < patients.length; i++) {
      const attr = {firstName: patients[i].firstName, lastName: patients[i].lastName, role: 'patient'};
      await enrollRegisterUser('PID'+i, JSON.stringify(attr));
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description This method clears wallet before enrolling admins of organizations and registering new users
 */
async function clearWallet() {
  try {
    const walletPath = path.join(__dirname, '../patient-asset-transfer/application-javascript/wallet');

    fs.readdir(walletPath, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        console.log(file);
        fs.unlink(path.join(walletPath, file), (err) => {
          if (err) throw err;
        });
      }

      console.log('Wallet has cleared.');
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * @description Function to initialise the backend server, enrolls and regsiter the admins and initLedger patients.
 * @description Need not run this manually, included as a prestart in package.json
 */
async function main() {
  await clearWallet();
  await enrollAdminHosp1();
  await enrollAdminHosp2();
  await initLedger();
}


main();
