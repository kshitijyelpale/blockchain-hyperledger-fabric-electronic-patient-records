/* eslint-disable new-cap */
/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2021-01-27 15:50:20
 * @modify date 2021-02-03 23:03:13
 * @desc Utils methods
 */
const redis = require('redis');
const util = require('util');

exports.ROLE_ADMIN = 'admin';
exports.ROLE_DOCTOR = 'doctor';
exports.ROLE_PATIENT = 'patient';

exports.CHANGE_TMP_PASSWORD = 'CHANGE_TMP_PASSWORD';

/**
 * @param  {Boolean} isError Returns a success msg if False else a success message
 * @param  {String} message Content of the message
 * @param {String} id username/userId of the user
 * @param  {String} password Password of the user
 * @return {JSON} Json message
 * @description Return a simple JSON message based on success or failure
 * @example returns {success:message} or {error:message}
 */
exports.getMessage = function(isError, message, id = '', password = '') {
  if (isError) {
    return {error: message};
  } else {
    return {success: message, id: id, password: password};
  }
};

/**
 * @param  {string[]} roles The roles delimited by | against which the validation needs to be done
 * @param  {String} reqRole The role to be validated
 * @param  {Response} res 401 is reqRole is not present n roles
 * @description Validation of the role
 * @example roles - 'patient|doctor' reqRole - 'admin' returns 401
 */
exports.validateRole = async function(roles, reqRole, res) {
  if (!reqRole || !roles || reqRole.length === 0 || roles.length === 0 || !roles.includes(reqRole)) {
    // user's role is not authorized
    return res.sendStatus(401).json({message: 'Unauthorized Role'});
  }
};

/**
 * @param  {String} s Any string
 * @return {String} First letter capitalized string
 * @description Capitalizes the first letter of the string
 */
exports.capitalize = function(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * @param  {int} hospitalId
 * @description Creates a redis client based on the hospitalID and allows promisify methods using util
 */
exports.createRedisClient = async function(hospitalId) {
  // TODO: Handle using config file
  let redisPassword;
  if (hospitalId === 1) {
    redisUrl = 'redis://127.0.0.1:6379';
    redisPassword = 'hosp1lithium';
  } else if (hospitalId === 2) {
    redisUrl = 'redis://127.0.0.1:6380';
    redisPassword = 'hosp2lithium';
  } else if (hospitalId === 3) {
    redisUrl = 'redis://127.0.0.1:6381';
    redisPassword = 'hosp3lithium';
  }
  const redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);
  // NOTE: Node Redis currently doesn't natively support promises
  // Util node package to promisify the get function of the client redis
  redisClient.get = util.promisify(redisClient.get);
  return redisClient;
};
