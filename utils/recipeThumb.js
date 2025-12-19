import fs from "fs";
import path from "path";

const RECIPES_DIR = path.join(process.cwd(), "public", "recipes");

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const saveRecipeThumb = async (file, recipeId) => {
  if (!file || !recipeId) return null;
  ensureDir(RECIPES_DIR);
  const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
  const filename = `${recipeId}${ext}`;
  const destPath = path.join(RECIPES_DIR, filename);
  // Remove any existing file for this recipeId to avoid stale images
  try {
    if (fs.existsSync(destPath)) {
      await fs.promises.unlink(destPath);
    }
  } catch (_) {}
  await fs.promises.rename(file.path, destPath);
  return {
    thumbURL: `/recipes/${filename}`,
    filePath: destPath,
    filename,
  };
};
