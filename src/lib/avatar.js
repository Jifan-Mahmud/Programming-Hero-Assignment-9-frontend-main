/**
 * Generates an SVG data URI avatar that loads instantly (0ms network request)
 * and is 100% resilient to network failures, CORS, or blocked CDNs.
 */
export const generateAvatarSvg = (name = "User") => {
  const cleanName = (name || "User").trim();
  const initial = (cleanName.charAt(0) || "U").toUpperCase();
  const bgColors = [
    "#0D9488",
    "#0284C7",
    "#7C3AED",
    "#DB2777",
    "#D97706",
    "#059669",
    "#4F46E5",
  ];
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = bgColors[Math.abs(hash) % bgColors.length];

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${encodeURIComponent(
    color
  )}" rx="50"/><text x="50" y="58" font-size="44" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(
    initial
  )}</text></svg>`;
};

/**
 * Returns a valid photo URL or SVG fallback.
 */
export const getSafeUserPhoto = (user) => {
  if (!user) return generateAvatarSvg("User");
  const raw = user.photoURL || user.image;
  if (raw && typeof raw === "string" && raw.trim() !== "") {
    return raw.trim();
  }
  return generateAvatarSvg(user.name);
};
