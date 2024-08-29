import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("Contragents API CALLED");
  const data = await fs.readFile("./public/kontragents_new.JSON", "utf-8");
  
  let contragents = JSON.parse(data);
  
  
    return contragents;
 
});
