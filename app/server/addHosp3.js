/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2021-03-13 15:02:08
 * @modify date 2021-03-13 15:02:40
 * @desc Add admin of Hosp3. Execute node addHosp3.js to execute
 */


/* eslint-disable new-cap */
const {enrollAdminHosp3} = require('./enrollAdmin-Hospital3');
const redis = require('redis');

/**
 * @description enrol admin of hospital 3 in redis
 */
async function initRedis3() {
  redisUrl = 'redis://127.0.0.1:6381';
  redisPassword = 'hosp3lithium';
  redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);
  redisClient.SET('hosp3admin', redisPassword);
  console.log('Done');
  redisClient.QUIT();
  return;
}

/**
 * @description enrol admin of hospital 3
 */
async function main() {
  await enrollAdminHosp3();
  await initRedis3();
}

main();
