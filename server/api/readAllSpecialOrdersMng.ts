import { defineEventHandler } from "h3";
import { readdir } from "fs/promises";
import { join } from "path";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("READ ALL SPECIAL MNG ORDERS API CALLED");

  const dirPath =
    process.env.NODE_ENV === "development"
      ? "./public/SpecialOrders"
      : "/var/www/www-root/data/www/b2.belca.by/SpecialOrders";

  const files = await readdir(dirPath);
  const jsonFiles = files.filter((file) => file.endsWith(".MANG"));

  const allOrders = [];

  for (const file of jsonFiles) {
    const filePath = join(dirPath, file);
    const data = await fs.readFile(filePath, "utf-8");
    try {
      const orders = JSON.parse(data);
      allOrders.push(...orders);
    } catch (error) {
      console.error(`Error parsing JSON from file ${file}:`, error);
    }
  }

  return allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

