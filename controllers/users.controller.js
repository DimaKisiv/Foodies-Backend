import * as UsersService from "../services/users.service.js";
import HttpError from "../utils/HttpError.js";

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

export async function getUserDetails(req, res, next) {
  try {
    const { id } = req.params;
    const user = await UsersService.getUserDetailsById(id);
    if (!user) throw HttpError(404, "User not found");
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function listFollowers(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");
    const followers = await UsersService.getFollowers(user.id);
    res.json({ items: followers, total: followers.length });
  } catch (err) {
    next(err);
  }
}

export async function listFollowing(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");
    const following = await UsersService.getFollowing(user.id);
    res.json({ items: following, total: following.length });
  } catch (err) {
    next(err);
  }
}

export async function followUser(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");
    const { id: targetUserId } = req.params;
    if (user.id === targetUserId) {
      throw HttpError(400, "Cannot follow yourself");
    }
    await UsersService.followUser(user.id, targetUserId);
    res.json({ message: "Successfully followed user" });
  } catch (err) {
    next(err);
  }
}

export async function unfollowUser(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");
    const { id: targetUserId } = req.params;
    await UsersService.unfollowUser(user.id, targetUserId);
    res.json({ message: "Successfully unfollowed user" });
  } catch (err) {
    next(err);
  }
}
