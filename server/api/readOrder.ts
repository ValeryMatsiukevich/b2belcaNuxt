import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("READORDER API CALLED");
  const body = await readBody(event);
  console.log(body.unp);

  // Check if file exists
  const filePath = "./public/Orders/" + body.unp + ".JSON";
  try {
    await fs.access(filePath);
  } catch {
    console.log("Order file does not exist");
    return [];
  }

  const data = await fs.readFile(filePath, "utf-8");
  let order = JSON.parse(data);
 // order = favs.map((item:Goods) => ({ NomCode: item.NomCode }));
  if (order !== undefined) return order;
  else return [];
});
