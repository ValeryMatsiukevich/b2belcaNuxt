import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("WRITE SPECIAL ORDER MNG API CALLED");
  const body = await readBody(event);
  // console.log(body);

  let filePath = "";
  // Check if file exists
  if (process.env.NODE_ENV === "development") {
    filePath = "./public/SpecialOrders/" + body.unp + ".MANG";
  } else {
    filePath =
      "/var/www/www-root/data/www/b2.belca.by/SpecialOrders/" + body.unp + ".MANG";
  }
  try {
    await fs.writeFile(filePath, JSON.stringify(body.order), "utf-8");
    console.log("Special order mng file written successfully");
  } catch (error) {
    console.error("Error writing Special Order mng file:", error);
  }
});
