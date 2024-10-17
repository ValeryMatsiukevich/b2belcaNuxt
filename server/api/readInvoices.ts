import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("INVOICES API CALLED");

  // Check if file exists
  const filePath = "./public/invoices.json";
  try {
    await fs.access(filePath);
  } catch {
    console.log("Invoices file does not exist");
    return [];
  }

  let data: string | null = await fs.readFile(filePath, "utf-8");
  let balance = JSON.parse(data);
  data = null;
  if (balance !== undefined) return balance;
  else return [];
});
