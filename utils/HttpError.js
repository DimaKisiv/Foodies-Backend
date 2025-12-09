export default function HttpError(status = 500, message = "Error") {
  const err = new Error(message);
  err.status = status;
  return err;
}
