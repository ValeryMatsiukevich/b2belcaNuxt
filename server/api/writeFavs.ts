import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("WRITEFAVS API CALLED");
  const credentials = await readBody(event);
  console.log(credentials);
  

  // Check if file exists
  const filePath = "./public/Favlists/" + credentials.unp + ".JSON";
  try {
    await fs.writeFile(filePath, JSON.stringify(credentials.favs), "utf-8");
    console.log("Favs file written successfully");
  } catch (error) {
    console.error("Error writing Favs file:", error);
  }
});
