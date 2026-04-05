import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const contentType = "image/png";

export default async function Icon() {
  const iconPath = path.join(process.cwd(), "public", "icon.png");
  const icon = await readFile(iconPath);

  return new Response(icon, {
    headers: {
      "Content-Type": contentType,
    },
  });
}
