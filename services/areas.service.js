import { Area } from "../models/index.js";

export async function listAreas() {
  return await Area.findAll({
    order: [["name", "ASC"]],
  });
}
