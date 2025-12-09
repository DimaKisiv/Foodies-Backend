import HttpError from "../utils/HttpError.js";
import * as AuthService from "../services/auth.service.js";
import { saveUploadedAvatar } from "../utils/avatarHelper.js";

export async function register(req, res, next) {
  try {
    const result = await AuthService.registerService(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await AuthService.loginService(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await AuthService.logoutService(req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function current(req, res, next) {
  try {
    const authUser = req.user;
    if (!authUser) throw HttpError(401, "Not authorized");
    const user = await AuthService.currentService(authUser.id);
    res.json(user);
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
    user.avatarURL = publicUrl;
    await user.save();

    res.status(200).json({ avatarURL: publicUrl });
  } catch (err) {
    next(err);
  }
};
