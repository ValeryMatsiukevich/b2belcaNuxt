import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("OSTATKI API CALLED");
  // const credentials = await readBody(event);
  // console.log(credentials);
  const data2 = await fs.readFile("./public/ost8skl.json", "utf-8");
  //const data1 = await fs.readFile("./public/ost_tip_cen.json", "utf-8");
  //const data = await fs.readFile("./public/nom1c8b2b.json", "utf-8");
  //let goods = JSON.parse(data);
  //let prices = JSON.parse(data1);
  let ostatki = JSON.parse(data2);
  // prices = prices.filter((el: { TipCenCode: string }) => el.TipCenCode === "000000006");
  // goods = goods.filter(
  //   (el: { IsGropup: string }) =>
  //     el.IsGropup === "Нет" 
  // );
  
  // const filteredOstatki = ostatki.filter(
  //   (el: Ostatki) => el.Sklad === "000000014" || el.Sklad === "000000006"
  // );
  
  // goods = goods.map((element: Goods) => {
  //   const price = prices.find(
  //     (el: { NomCode: string }) => el.NomCode === element.NomCode
  //   );
  //   if (price) {
  //     element.Price = price.Cena;
  //   }
  
  //   const ostatok = filteredOstatki.filter(
  //     (el: Ostatki) => el.NomCode === element.NomCode
  //   );
  //   element.Quantity = ostatok.reduce(
  //     (acc: number, curr: { quantity: any; }) => acc + Number(curr.quantity),
  //     0
  //   );
  
  //   return element;
  // });
  //console.log(goods.length)
  return ostatki;
});
