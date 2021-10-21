// inherit from Error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); 

    this.statusCode = statusCode;

    // convert statusCode to string for checking with String method
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'; 

    // make sure only send error messages created using this class, b/c unexpected errors might happens: programming error / bugs packages
    this.isOperational = true; 

    Error.captureStackTrace(this, this.constructor); // not add this method to stack trace
  }
}

module.exports = AppError;