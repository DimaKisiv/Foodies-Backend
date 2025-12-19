export const getBaseUrl = (req) => {
  const envUrl =
    process.env.PUBLIC_URL && String(process.env.PUBLIC_URL).trim();
  if (envUrl) return envUrl.replace(/\/$/, "");
  const proto = (req.get("x-forwarded-proto") || req.protocol || "http").split(
    ","
  )[0];
  const host = req.get("x-forwarded-host") || req.get("host") || "localhost";
  return `${proto}://${host}`;
};

export const absolutizeRecipeThumb = (entity, req) => {
  if (!entity) return entity;
  if (Array.isArray(entity))
    return entity.map((e) => absolutizeRecipeThumb(e, req));
  const obj = { ...entity };
  if (typeof obj.thumb === "string" && obj.thumb.startsWith("/")) {
    obj.thumb = `${getBaseUrl(req)}${obj.thumb}`;
  }
  if (
    obj.owner &&
    typeof obj.owner.avatar === "string" &&
    obj.owner.avatar.startsWith("/")
  ) {
    obj.owner = {
      ...obj.owner,
      avatar: `${getBaseUrl(req)}${obj.owner.avatar}`,
    };
  }
  return obj;
};
