import * as AreasService from "../services/areas.service.js";

export async function listAreas(req, res, next) {
  try {
    const items = await AreasService.listAreas();
    res.json({ items, total: items.length });
  } catch (err) {
    next(err);
  }
}
