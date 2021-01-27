/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2021-01-27 15:50:20
 * @modify date 2021-01-27 16:10:11
 * @desc Utils methods
 */

/**
 * @param  {Boolean} isError Returns a success msg if False else a success message
 * @param  {String} message Content of the message
 * @return {JSON} Json message
 * @description Return a simple JSON message based on success or failure
 * @example returns {success:message} or {error:message}
 */
exports.getMessage = function(isError, message) {
  if (isError) {
    return {error: message};
  } else {
    return {success: message};
  }
};

/**
 * @param  {String} roles The roles delimited by | against which the validation needs to be done
 * @param  {String} reqRole The role to be validated
 * @param  {Response} res 401 is reqRole is not present n roles
 * @description Validation of the role
 * @example roles - 'patient|doctor' reqRole - 'admin' returns 401
 */
exports.validateRole = async function(roles, reqRole, res) {
  roles = roles.split('|');
  if (!reqRole || !roles || reqRole.length === 0 || roles.length === 0 || !roles.includes(reqRole)) {
    // user's role is not authorized
    return res.sendStatus(401).json({message: 'Unauthorized'});
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
