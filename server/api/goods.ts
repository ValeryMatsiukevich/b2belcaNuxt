import { defineEventHandler } from "h3";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  console.log("GOODS API CALLED");
  // const credentials = await readBody(event);
  // console.log(credentials);
  //const data2 = await fs.readFile("./public/ost8skl.json", "utf-8");
  const data1 = await fs.readFile("./public/ost_tip_cen.json", "utf-8");
  const type = await readBody(event);

  if (!type) {
    return new Response("Missing 'type' parameter", { status: 400 });
  }
  console.log("TYPE:" + JSON.stringify(type.type));
  const data = await fs.readFile("./public/nom1c8b2b.json", "utf-8");
  let goods = JSON.parse(data) as Goods[];
  let prices = JSON.parse(data1);
  //let ostatki = JSON.parse(data2);
  prices = prices.filter(
    (el: { TipCenCode: string }) => el.TipCenCode === type.type
  );
  goods = goods.filter((el: { IsGropup: string }) => el.IsGropup === "Нет");

  goods = goods.map((element: Goods) => {
    const price = prices.find(
      (el: { NomCode: string }) => el.NomCode === element.NomCode
    );
    if (price) {
      element.Price = price.Cena;
    }
    return element;
  });

  console.log(goods.length);
  return goods;
});
