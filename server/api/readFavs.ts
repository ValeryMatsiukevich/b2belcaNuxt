import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("READFAVS API CALLED");
  const credentials = await readBody(event);
  console.log(credentials.unp);

  // Check if file exists
  const filePath = "./public/Favlists/" + credentials.unp + ".JSON";
  try {
    await fs.access(filePath);
  } catch {
    console.log("Favs file does not exist");
    return [];
  }

  let data: string | null = await fs.readFile(filePath, "utf-8");
  let favs = JSON.parse(data);
  favs = favs.map((item: Goods) => ({ NomCode: item.NomCode }));
  data = null;
  if (favs !== undefined) return favs;
  else return [];
});
