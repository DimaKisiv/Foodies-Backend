import fs from "fs";
import path from "path";

const AVATARS_DIR = path.join(process.cwd(), "public", "avatars");

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const saveUploadedAvatar = async (file, userId) => {
  ensureDir(AVATARS_DIR);
  const ext =
    path.extname(file?.originalname || "").toLowerCase() || ".jpg" || ".jpg";
  const uniqueName = `${userId}_${Date.now()}${ext}`;
  const destPath = path.join(AVATARS_DIR, uniqueName);
  await fs.promises.rename(file.path, destPath);
  return {
    avatarURL: `/avatars/${uniqueName}`,
    filePath: destPath,
    filename: uniqueName,
  };
};
