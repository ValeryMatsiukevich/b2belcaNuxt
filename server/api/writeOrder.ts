import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("WRITEORDER API CALLED");
  const body = await readBody(event);
  console.log(body);
  

  // Check if file exists
  const filePath = "./public/Orders/" + body.unp + ".JSON";
  try {
    await fs.writeFile(filePath, JSON.stringify(body.order), "utf-8");
    console.log("Order file written successfully");
  } catch (error) {
    console.error("Error writing Order file:", error);
  }
});
