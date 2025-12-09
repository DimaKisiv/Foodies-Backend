import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {
  User,
  Area,
  Category,
  Ingredient,
  Recipe,
  Testimonial,
} from "../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");

function readJson(name) {
  const p = path.join(dataDir, name);
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}

function oid(doc) {
  if (doc && doc.$oid) return doc.$oid;
  return doc;
}

function numDate(msObj) {
  if (!msObj || !msObj.$date || !msObj.$date.$numberLong) return undefined;
  const ms = Number(msObj.$date.$numberLong);
  return new Date(ms);
}

export async function runSeed() {
  try {
    console.log("   Database connection successful");
    const usersJson = readJson("users.json");
    const areasJson = readJson("areas.json");
    const categoriesJson = readJson("categories.json");
    const ingredientsJson = readJson("ingredients.json");
    const recipesJson = readJson("recipes.json");
    const testimonialsJson = readJson("testimonials.json");

    // Seed Users
    const users = usersJson.map((u) => ({
      id: oid(u._id),
      name: u.name,
      avatar: u.avatar ?? null,
      email: u.email,
    }));
    await User.bulkCreate(users, { ignoreDuplicates: true });

    // Seed Areas
    const areas = areasJson.map((a) => ({ id: oid(a._id), name: a.name }));
    await Area.bulkCreate(areas, { ignoreDuplicates: true });

    // Seed Categories
    const categories = categoriesJson.map((c) => ({
      id: oid(c._id),
      name: c.name,
    }));
    await Category.bulkCreate(categories, { ignoreDuplicates: true });

    // Seed Ingredients
    const ingredients = ingredientsJson.map((i) => ({
      id: i._id,
      name: i.name,
      desc: i.desc ?? null,
      img: i.img ?? null,
    }));
    await Ingredient.bulkCreate(ingredients, { ignoreDuplicates: true });

    // Seed Recipes
    const recipes = recipesJson.map((r) => ({
      id: oid(r._id),
      title: r.title,
      description: r.description ?? null,
      instructions: r.instructions ?? null,
      thumb: r.thumb ?? null,
      time: r.time ? Number(r.time) : null,
      category: r.category ?? null,
      area: r.area ?? null,
      ownerId: oid(r.owner),
      ingredients: Array.isArray(r.ingredients)
        ? r.ingredients.map((ing) => ({ id: ing.id, measure: ing.measure }))
        : [],
      createdAt: numDate(r.createdAt) ?? undefined,
      updatedAt: numDate(r.updatedAt) ?? undefined,
    }));
    await Recipe.bulkCreate(recipes, { ignoreDuplicates: true });

    // Seed Testimonials
    const testimonials = testimonialsJson.map((t) => ({
      id: oid(t._id),
      ownerId: oid(t.owner),
      testimonial: t.testimonial,
    }));
    await Testimonial.bulkCreate(testimonials, { ignoreDuplicates: true });

    console.log("Seeding complete.");
  } catch (err) {
    console.error("Seeding failed:", err);
    throw err;
  }
}
