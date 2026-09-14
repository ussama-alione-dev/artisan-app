// middleware/validate.js — checks express-validator results
// put this middleware after your validation rules in a route
const { validationResult } = require("express-validator");

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // just send back the first error message to keep things simple
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  next();
}

module.exports = validate;
