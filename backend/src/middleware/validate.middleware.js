function validate(validator) {
  return (req, res, next) => {
    const errors = validator(req);

    if (!Array.isArray(errors) || errors.length === 0) {
      return next();
    }

    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  };
}

module.exports = validate;
