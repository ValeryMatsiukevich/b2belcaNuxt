import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("Managers API CALLED");
  const data = await fs.readFile("./public/managers.json", "utf-8");
  
  let managers = JSON.parse(data);
  
  
    return managers;
 
});
