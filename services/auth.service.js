import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../utils/HttpError.js";
import { User, Recipe, Testimonial } from "../models/index.js";

export async function registerService({ name, email, password, avatar }) {
  if (!name || !email || !password) {
    throw HttpError(400, "name, email, password are required");
  }
  const existing = await User.findOne({ where: { email } });
  if (existing) throw HttpError(409, "Email in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const id = (
    Math.random().toString(16).slice(2) + Date.now().toString(16)
  ).slice(0, 24);

  const user = await User.create({
    id,
    name,
    email,
    avatar: avatar ?? null,
    passwordHash,
  });
  const secret = process.env.JWT_SECRET;
  if (!secret) throw HttpError(500, "Server misconfiguration");
  const token = jwt.sign({ id: user.id }, secret, { expiresIn: "7d" });
  await user.update({ token });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  };
}

export async function loginService({ email, password }) {
  if (!email || !password)
    throw HttpError(400, "email and password are required");
  const user = await User.findOne({ where: { email } });
  if (!user || !user.passwordHash)
    throw HttpError(401, "Email or password is wrong");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw HttpError(401, "Email or password is wrong");
  const secret = process.env.JWT_SECRET;
  if (!secret) throw HttpError(500, "Server misconfiguration");
  const token = jwt.sign({ id: user.id }, secret, { expiresIn: "7d" });
  await user.update({ token });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  };
}

export async function logoutService(user) {
  if (!user) throw HttpError(401, "Not authorized");
  await user.update({ token: null });
}

export async function currentService(userId) {
  const user = await User.findByPk(userId, {
    include: [
      { model: User, as: "followers" },
      { model: User, as: "following" },
      { model: Recipe, as: "recipes" },
      { model: Recipe, as: "favoriteRecipes" },
      { model: Testimonial, as: "testimonials" },
    ],
  });
  if (!user) throw HttpError(404, "User not found");
  return user;
}
