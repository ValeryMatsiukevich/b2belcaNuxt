import { defineEventHandler } from "h3";
import fs from "fs/promises";
import axios from "axios";

export default defineEventHandler(async (event) => {
  console.log("GOODS API CALLED");

  const [data1, data, data2] = await Promise.all([
    fs.readFile("./public/ost_tip_cen.json", "utf-8"),
    fs.readFile("./public/nom1c8b2b.json", "utf-8"),
    fs.readFile("./public/ost8skl.json", "utf-8"),
  ]);

  const body = await readBody(event);

  if (!body) {
    return new Response("Missing 'body' parameter", { status: 400 });
  }

  console.log("BODY:" + JSON.stringify(body));

  let goods = JSON.parse(data) as Goods[];
  let prices = JSON.parse(data1);
  let ostatki = JSON.parse(data2);
  let kursyRaw = []; 
  try {
    

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://base.belca.by/UT/hs/Products/Kursy/`,
      headers: {
        Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
      },
    };

    const response = await axios.request(config);
 //   console.log(JSON.stringify(response.data));
    kursyRaw = response.data;
  } catch (error) {
    console.log(error);
    kursyRaw = [];
  }

  //let kursy = JSON.parse(kursyRaw);

  let pricesMain = prices.filter(
    (el: { TipCenCode: string }) => el.TipCenCode === body.type
  );

  goods = goods.filter((el: { IsGropup: string }) => el.IsGropup === "Нет");

  goods = goods.map((element: Goods) => {
    const price = pricesMain.find(
      (el: { NomCode: string }) => el.NomCode === element.NomCode
    );

    if (price) {
      element.Price = price.Cena;
    }

    return element;
  });

  if(body.spec) {
  //  console.log(body.spec);
    let pricesSpec = prices.filter(
      (el: { TipCenCode: string }) => el.TipCenCode === body.spec
    );
    goods = goods.map((element: Goods) => {
      const price = pricesSpec.find(
        (el: { NomCode: string }) => el.NomCode === element.NomCode
      );
  
      if (price) {
        
        let kurs=kursyRaw.find( (el:Kursy)  => el.Valuta === price.ValutaCode)
        
        if (kurs.Kratnost !== 0) {
          element.Price = (Math.round((price.Cena.replace(",",".") * kurs.Kurs / kurs.Kratnost) * 100) / 100).toString();
        } else {
          element.Price = "N/A"; // or any other default value
        }
       // console.log("price.Cena:", element.Price);
      //  console.log("kurs.Kurs:", kurs.Kurs);
      //  console.log("kurs.Kratnost:", kurs.Kratnost);
        
      }
  
      return element;
    });
  }
   
  ostatki.forEach((ostatok: Ostatki) => {
    goods = goods.map((element: Goods) => {
      if (element.NomCode === ostatok.NomCode) {
        element[`Skl${ostatok.Sklad}`] = ostatok.quantity;
        element[`Res${ostatok.Sklad}`] = ostatok.Rezerv;
       
      }
      return element;
    });
  });

  console.log(goods.length);
  return goods;
});