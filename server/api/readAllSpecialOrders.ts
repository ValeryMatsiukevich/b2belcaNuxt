// import { defineEventHandler } from "h3";
// import { readdir, readFile } from "fs/promises";
// import { join } from "path";

// export default defineEventHandler(async (event) => {
//   console.log("READ ALL SPECIAL ORDERS API CALLED");

//   const dirPath =
//     process.env.NODE_ENV === "development"
//       ? "./public/SpecialOrders"
//       : "/var/www/www-root/data/www/b2.belca.by/SpecialOrders";

//   const files = await readdir(dirPath);
//   const jsonFiles = files.filter((file) => file.endsWith(".JSON"));
//   const jsonFilesMng = files.filter((file) => file.endsWith(".MANG"));

//   const readAndParseFiles = async (fileList) => {
//     const orders = [];
//     for (const file of fileList) {
//       const filePath = join(dirPath, file);
//       try {
//         const data = await readFile(filePath, "utf-8");
//         orders.push(...JSON.parse(data));
//       } catch (error) {
//         console.error(`Error parsing JSON from file ${file}:`, error);
//       }
//     }
//     return orders;
//   };

//   const [allOrders, allOrdersMng] = await Promise.all([
//     readAndParseFiles(jsonFiles),
//     readAndParseFiles(jsonFilesMng),
//   ]);

//   const guidSet = new Set(allOrders.map(order => order.guid));

//   const updatedOrders = allOrders.map(order => {
//     const orderMng = allOrdersMng.find(orderMng => orderMng.guid === order.guid);
//     if (orderMng) {
//       return {
//         ...order,
//         client: orderMng.client,
//         good: orderMng.good,
//         quantity: orderMng.quantity,
//         price: orderMng.price,
//         response: orderMng.response,
//         term: orderMng.term,
//         type: orderMng.type,
//         supplier: orderMng.supplier,
//         date: new Date(order.date) > new Date(orderMng.date) ? order.date : orderMng.date,
//         status: Math.max(order.status, orderMng.status),
//       };
//     }
//     return order;
//   });

//   const missingOrders = allOrders.filter(order => !guidSet.has(order.guid));
//   const missingOrderMng = allOrdersMng.filter(order => !guidSet.has(order.guid));
//   const mergedOrders = [...updatedOrders, ...missingOrders,...missingOrderMng];

//   return mergedOrders;
// });

import { defineEventHandler } from "h3";
import { readdir } from "fs/promises";
import { join } from "path";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("READ ALL SPECIAL ORDERS API CALLED");

  const dirPath =
    process.env.NODE_ENV === "development"
      ? "./public/SpecialOrders"
      : "/var/www/www-root/data/www/b2.belca.by/SpecialOrders";

  const files = await readdir(dirPath);
  const jsonFiles = files.filter((file) => file.endsWith(".JSON"));

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

