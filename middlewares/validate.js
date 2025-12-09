import HttpError from "../utils/HttpError.js";

const validate = (schema) => async (req, _res, next) => {
  try {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(
        HttpError(400, error.details.map((d) => d.message).join(", "))
      );
    }
    req.body = value;
    next();
  } catch (err) {
    next(err);
  }
};

export default validate;
