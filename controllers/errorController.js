module.exports = (err, req, res, next) => {
  console.log(err.stack); // stack trace -> holds where error occur

  err.statusCode = err.statusCode || 500; // default: internal server error
  err.status = err.status || 'error';

  return res.status(err.statusCode).render("pages/error", {
    title: err.statusCode + " error - " + err.status,
    message: err.message
  });
}