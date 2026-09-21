/**
 * Builds the uniform JSON response { success, data, message }.
 */

function success(data = null, message = 'Operación exitosa.') {
  return { success: true, data, message };
}

function failure(message = 'Ocurrió un error.', data = null) {
  return { success: false, data, message };
}

module.exports = { success, failure };
