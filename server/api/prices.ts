// import { defineEventHandler } from "h3";
// import fs from "fs/promises";


// export default defineEventHandler(async (event) => {
//   console.log("PRICES API CALLED");
  
  
//   const data1 = await fs.readFile("./public/ost_tip_cen.json", "utf-8");
    
//   let prices = JSON.parse(data1);
    
//   return prices;
// });

import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  
  console.log("PRICES API CALLED ", event.node.req.url.split("?")[1].split("=")[1]);
  const type = event.node.req.url.split("?")[1].split("=")[1]
  

   if (!type) {
     return new Response("Missing 'type' parameter", { status: 400 });
   }

   const data1 = await fs.readFile("./public/ost_tip_cen.json", "utf-8");

   let prices = JSON.parse(data1);

   // Filter prices based on the received 'type' parameter
   prices = prices.filter((price:Prices) => price.TipCenCode === type);

   return prices;
});