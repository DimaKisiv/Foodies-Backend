// Converts multipart text fields into proper types for validation/creation
export default function parseRecipeBody(req, _res, next) {
  try {
    // Only adjust when content is multipart/form-data
    const ct = req.headers["content-type"] || "";
    if (!ct.toLowerCase().includes("multipart/form-data")) {
      return next();
    }
    // Normalize simple fields
    if (typeof req.body.time === "string" && req.body.time.trim() !== "") {
      const n = Number(req.body.time);
      if (!Number.isNaN(n)) req.body.time = n;
    }
    // Ingredients may arrive as JSON string
    if (typeof req.body.ingredients === "string") {
      try {
        const parsed = JSON.parse(req.body.ingredients);
        if (Array.isArray(parsed)) req.body.ingredients = parsed;
      } catch (_) {
        // leave as-is; validation middleware will report
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}
