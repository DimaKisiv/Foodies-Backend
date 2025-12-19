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
  const ext = path.extname(file?.originalname || "").toLowerCase() || ".jpg";
  const fileName = `${userId}${ext}`;
  const destPath = path.join(AVATARS_DIR, fileName);
  await fs.promises.rename(file.path, destPath);
  return {
    avatarURL: `/avatars/${fileName}`,
    filePath: destPath,
    filename: fileName,
  };
};
