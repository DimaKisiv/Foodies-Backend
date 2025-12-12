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
