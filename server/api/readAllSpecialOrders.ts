// import { defineEventHandler } from "h3";
// import { readdir } from "fs/promises";
// import { join } from "path";
// import fs from "fs/promises";

// export default defineEventHandler(async (event) => {
//   console.log("READ ALL SPECIAL ORDERS API CALLED");

//   const dirPath =
//     process.env.NODE_ENV === "development"
//       ? "./public/SpecialOrders"
//       : "/var/www/www-root/data/www/b2.belca.by/SpecialOrders";

//   const files = await readdir(dirPath);
//   const jsonFiles = files.filter((file) => file.endsWith(".JSON"));
//   const jsonFilesMng = files.filter((file) => file.endsWith(".MANG"));

//   const allOrders = [];
//   const allOrdersMng = [];

//   for (const file of jsonFiles) {
//     const filePath = join(dirPath, file);
//     const data = await fs.readFile(filePath, "utf-8");
//     try {
//       const orders = JSON.parse(data);
//       allOrders.push(...orders);
//     } catch (error) {
//       console.error(`Error parsing JSON from file ${file}:`, error);
//     }
//   }

//   for (const file of jsonFilesMng) {
//     const filePath = join(dirPath, file);
//     const data = await fs.readFile(filePath, "utf-8");
//     try {
//       const orders = JSON.parse(data);
//       allOrdersMng.push(...orders);
//     } catch (error) {
//       console.error(`Error parsing JSON from file ${file}:`, error);
//     }
//   }

//   const guidSet = new Set(allOrders.map(order => order.guid));

//   for (const orderMng of allOrdersMng) {
//     const order = allOrders.find(order => order.guid === orderMng.guid);
//     if (order) {
//       orderMng.client = order.client;
//       orderMng.good = order.good;
//       orderMng.quantity = order.quantity;
//       order.price = orderMng.price;
//       order.responce = orderMng.responce;
//       order.term = orderMng.term;
//       const date1 = new Date(order.date);
//       const date2 = new Date(orderMng.date);
//       order.date = date2 > date1 ? order.date : orderMng.date;
//       if(order.status > orderMng.status) {
//         orderMng.status = order.status;
//       } else if(orderMng.status > order.status) {
//         order.status = orderMng.status;
//       }
      
//     }
//   }

//   const missingOrders = allOrdersMng.filter(order => !guidSet.has(order.guid));

//   allOrders.push(...missingOrders);

//   return allOrders.flat();
// });

import { defineEventHandler } from "h3";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  console.log("READ ALL SPECIAL ORDERS API CALLED");

  const dirPath =
    process.env.NODE_ENV === "development"
      ? "./public/SpecialOrders"
      : "/var/www/www-root/data/www/b2.belca.by/SpecialOrders";

  const files = await readdir(dirPath);
  const jsonFiles = files.filter((file) => file.endsWith(".JSON"));
  const jsonFilesMng = files.filter((file) => file.endsWith(".MANG"));

  const readAndParseFiles = async (fileList) => {
    const orders = [];
    for (const file of fileList) {
      const filePath = join(dirPath, file);
      try {
        const data = await readFile(filePath, "utf-8");
        orders.push(...JSON.parse(data));
      } catch (error) {
        console.error(`Error parsing JSON from file ${file}:`, error);
      }
    }
    return orders;
  };

  const [allOrders, allOrdersMng] = await Promise.all([
    readAndParseFiles(jsonFiles),
    readAndParseFiles(jsonFilesMng),
  ]);

  const guidSet = new Set(allOrders.map(order => order.guid));

  allOrdersMng.forEach(orderMng => {
    const order = allOrders.find(order => order.guid === orderMng.guid);
    if (order) {
      Object.assign(order, {
        client: orderMng.client,
        good: orderMng.good,
        quantity: orderMng.quantity,
        price: orderMng.price,
        responce: orderMng.responce,
        term: orderMng.term,
        date: new Date(order.date) > new Date(orderMng.date) ? order.date : orderMng.date,
        status: Math.max(order.status, orderMng.status),
      });
    }
  });

  const missingOrders = allOrdersMng.filter(order => !guidSet.has(order.guid));
  allOrders.push(...missingOrders);

  return allOrders.flat();
});
