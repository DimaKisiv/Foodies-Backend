import * as UsersService from "../services/users.service.js";

export async function listUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const result = await UsersService.listUsers({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      search,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
