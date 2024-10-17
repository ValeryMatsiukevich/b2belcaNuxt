import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("READORDER API CALLED");
  const body = await readBody(event);
  console.log(body.unp);
  let filePath = "";
  // Check if file exists
  if (process.env.NODE_ENV === "development") {
    filePath = "./public/Orders/" + body.unp + ".JSON";
  } else {
    filePath =
      "/var/www/www-root/data/www/b2.belca.by/Orders/" + body.unp + ".JSON";
  }
  try {
    await fs.access(filePath);
  } catch {
    console.log("Order file does not exist");
    return [];
  }

  let data: string | null = await fs.readFile(filePath, "utf-8");
  let order = JSON.parse(data);
  data = null;
  // order = favs.map((item:Goods) => ({ NomCode: item.NomCode }));
  if (order !== undefined) return order;
  else return [];
});
