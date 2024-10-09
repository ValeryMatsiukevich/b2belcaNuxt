import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("WRITEORDER API CALLED");
  const body = await readBody(event);
  // console.log(body);

  let filePath = "";
  // Check if file exists
  if (process.env.NODE_ENV === "development") {
    filePath = "./public/Orders/" + body.unp + ".JSON";
  } else {
    filePath =
      "/var/www/www-root/data/www/b2.belca.by/Orders/" + body.unp + ".JSON";
  }
  try {
    await fs.writeFile(filePath, JSON.stringify(body.order), "utf-8");
    console.log("Order file written successfully");
  } catch (error) {
    console.error("Error writing Order file:", error);
  }
});
