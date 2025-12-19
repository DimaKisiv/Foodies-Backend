import HttpError from "../utils/HttpError.js";

export default function requireThumbFile(req, _res, next) {
  try {
    if (!req.file) {
      return next(HttpError(400, "Photo is required"));
    }
    next();
  } catch (err) {
    next(err);
  }
}
