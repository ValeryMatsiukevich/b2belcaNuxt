import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("BALANCE API CALLED");

  // Check if file exists
  const filePath = "./public/balance.json";
  try {
    await fs.access(filePath);
  } catch {
    console.log("Balance file does not exist");
    return [];
  }

  const data = await fs.readFile(filePath, "utf-8");
  let balance = JSON.parse(data);

  if (balance !== undefined) return balance;
  else return [];
});
