import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("READ LOGINLOG API CALLED");
 
  let filePath = "";
  // Check if file exists
  if (process.env.NODE_ENV === "development") {
    filePath = "./public/LoginLog.JSON";
  } else {
    filePath =
      "/var/www/www-root/data/www/b2.belca.by/1c/LoginLog.JSON";
  }
  try {
    await fs.access(filePath);
  } catch {
    console.log("Order file does not exist");
    return [];
  }

  let data: string | null = await fs.readFile(filePath, "utf-8");
  try {
    const logEntries = data.split('\n').filter((line) => line.trim() !== '').map((line) => JSON.parse(line));
    return logEntries;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return { error: 'Invalid JSON data' };
  }
  
});
