import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("WRITE SPECIAL ORDER API CALLED");
  const body = await readBody(event);
  // console.log(body);

  let filePath = "";
  // Check if file exists
  if (process.env.NODE_ENV === "development") {
    filePath = "./public/SpecialOrders/" + body.unp + ".JSON";
  } else {
    filePath =
      "/var/www/www-root/data/www/b2.belca.by/SpecialOrders/" + body.unp + ".JSON";
  }
  try {
    await fs.writeFile(filePath, JSON.stringify(body.order), "utf-8");
    console.log("Special order file written successfully");
  } catch (error) {
    console.error("Error writing Special Order file:", error);
  }
});
