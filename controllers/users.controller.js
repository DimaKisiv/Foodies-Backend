import * as UsersService from "../services/users.service.js";
import * as AuthService from "../services/auth.service.js";
import HttpError from "../utils/HttpError.js";
import { saveUploadedAvatar } from "../utils/avatarHelper.js";
import { getBaseUrl } from "../utils/url.js";

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

export async function current(req, res, next) {
  try {
    const authUser = req.user;
    if (!authUser) throw HttpError(401, "Not authorized");
    const user = await AuthService.currentService(authUser.id);
    const base = getBaseUrl(req);
    const avatar =
      typeof user.avatar === "string" && user.avatar.startsWith("/")
        ? `${base}${user.avatar}`
        : user.avatar;
    res.json({ ...user, avatar });
  } catch (err) {
    next(err);
  }
}

export const updateAvatar = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    const file = req.file;
    if (!file) {
      throw HttpError(400, "No file uploaded");
    }

    const { avatarURL: publicUrl } = await saveUploadedAvatar(file, user.id);
    user.avatar = publicUrl;
    await user.save();

    const absolute = `${getBaseUrl(req)}${publicUrl}`;
    res.status(200).json({ avatarURL: absolute });
  } catch (err) {
    next(err);
  }
};

export async function getUserDetails(req, res, next) {
  try {
    const { id } = req.params;
    const user = await UsersService.getUserDetailsById(id);
    if (!user) throw HttpError(404, "User not found");
    const base = getBaseUrl(req);
    const avatar =
      typeof user.avatar === "string" && user.avatar.startsWith("/")
        ? `${base}${user.avatar}`
        : user.avatar;
    res.json({ ...user, avatar });
  } catch (err) {
    next(err);
  }
}

export async function listFollowers(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");
    const followers = await UsersService.getFollowers(user.id);
    const base = getBaseUrl(req);
    const absolutize = (p) =>
      typeof p === "string" && p.startsWith("/") ? `${base}${p}` : p;
    const items = followers.map((f) => {
      const obj = typeof f.toJSON === "function" ? f.toJSON() : { ...f };
      const avatar = absolutize(obj.avatar);
      const recipes = Array.isArray(obj.recipes)
        ? obj.recipes.map((r) => ({ id: r.id, thumb: absolutize(r.thumb) }))
        : [];
      return { id: obj.id, name: obj.name, avatar, recipes };
    });
    res.json({ items, total: items.length });
  } catch (err) {
    next(err);
  }
}

export async function listFollowersByUserId(req, res, next) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const { items, total } = await UsersService.listFollowersByUserId({
      userId: id,
      page: Number(page) || 1,
      limit: Number(limit) || 12,
    });
    const base = getBaseUrl(req);
    const absolutize = (p) =>
      typeof p === "string" && p.startsWith("/") ? `${base}${p}` : p;
    const mapped = items.map((f) => {
      const avatar = absolutize(f.avatar);
      const recipes = Array.isArray(f.recipes)
        ? f.recipes.map((r) => ({ id: r.id, thumb: absolutize(r.thumb) }))
        : [];
      return { id: f.id, name: f.name, avatar, recipes };
    });
    res.json({
      items: mapped,
      total,
      page: Number(page) || 1,
      limit: Number(limit) || 12,
    });
  } catch (err) {
    next(err);
  }
}

export async function listFollowing(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");
    const following = await UsersService.getFollowing(user.id);
    const base = getBaseUrl(req);
    const absolutize = (p) =>
      typeof p === "string" && p.startsWith("/") ? `${base}${p}` : p;
    const items = following.map((f) => {
      const obj = typeof f.toJSON === "function" ? f.toJSON() : { ...f };
      const avatar = absolutize(obj.avatar);
      const recipes = Array.isArray(obj.recipes)
        ? obj.recipes.map((r) => ({ id: r.id, thumb: absolutize(r.thumb) }))
        : [];
      return { id: obj.id, name: obj.name, avatar, recipes };
    });
    res.json({ items, total: items.length });
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
