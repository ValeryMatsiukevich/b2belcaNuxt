import { defineEventHandler } from "h3";
import fs from "fs/promises";
import axios from "axios";

class GoodsImpl implements Goods {
  NomCode: string;
  NomNaim: string;
  RoditelCode: string;
  slug: string;
  IsGropup: string;
  Quantity: number;
  Akcionniy: string;
  Vigr7712: string;
  ZapretProdazhiNARD: string;
  Price: string;
  inCart: number;

  constructor() {
    this.NomCode = "";
    this.NomNaim = "";
    this.RoditelCode = "";
    this.slug = "";
    this.IsGropup = "";
    this.Quantity = 0;
    this.Akcionniy = "";
    this.Vigr7712 = "";
    this.ZapretProdazhiNARD = "";
    this.Price = "";
    this.inCart = 0;
  }
  [key: string]: any;
  filter(arg0: (good: Goods) => boolean) {
    throw new Error("Method not implemented.");
  }
  map(arg0: (good: Goods) => Goods) {
    throw new Error("Method not implemented.");
  }
  find(arg0: (folder: Goods) => boolean): unknown {
    throw new Error("Method not implemented.");
  }
  [Symbol.iterator](): Iterator<Goods> {
    throw new Error("Method not implemented.");
  }
}
export default defineEventHandler(async (event) => {
  console.log("GOODS API CALLED");
  async function readFilesParallel(paths) {
    try {
      const data = await Promise.all(paths.map(path => fs.readFile(path, 'utf-8')));
      return data.map(JSON.parse); // если вы уверены, что все файлы JSON
    } catch (error) {
      console.error('Error reading files:', error);
      // Additional error handling can be added here
      return ([] as any[]);
    }
  }
  const body = await readBody(event);
  if (!body) {
    return new Response("Missing 'body' parameter", { status: 400 });
  }
  
  let [prices, goods, ostatki] = await readFilesParallel([
    './public/ost_tip_cen.json',
    './public/nom1c8b2b.json',
    './public/ost8skl.json'
  ]);
  //console.log(goods);

  let kursyRawCache = null;
async function getKursyRaw() {
  if (kursyRawCache) return kursyRawCache;
  try {
    const response = await axios.get("http://base.belca.by/UT/hs/Products/Kursy/", {
      headers: { Authorization: "Basic QW5kcmV5RXNvZGluOjE=" },
    });
    kursyRawCache = response.data;
    return kursyRawCache;
  } catch (error) {
    console.log('Error fetching kursy', error);
    return [];
  }
}

const kursyRaw = await getKursyRaw();

  //let kursy = JSON.parse(kursyRaw);
  const goodsMap = new WeakMap();

  goods.forEach((element: Goods) => {
    goodsMap.set(element, element);
  });
  let pricesMain:Prices[]  = [];
  if (prices) {
    pricesMain = prices.filter(
      (el: { TipCenCode: string }) => el.TipCenCode === body.type
    );
  }
  goods = goods.filter((el: { IsGropup: string }) => el.IsGropup === "Нет");

  goods = goods.map((element: Goods) => {
    const price = pricesMain.find(
      (el: { NomCode: string }) => el.NomCode === element.NomCode
    );

    if (price) {
      element.Price = price.Cena;
    } else {
      element.Price = "0";
    }

    return element;
  });

  if (body.spec && prices) {
    // console.log(body.spec);
    let pricesSpec = prices.filter(
      (el:Prices) => el.TipCenCode === body.spec
    );
    goods = goods.map((element: Goods) => {
      const price = pricesSpec.find(
        (el: Prices) => el.NomCode === element.NomCode
      );

      if (price && kursyRaw) {
        let kurs = kursyRaw.find((el: Kursy) => el.Valuta === price.ValutaCode);

        if (kurs.Kratnost !== 0) {
          element.Price = (
            Math.round(
              ((price.Cena.replace(",", ".") * kurs.Kurs) / kurs.Kratnost) * 100
            ) / 100
          ).toString();
        } else {
          element.Price = "0"; // or any other default value
        }
        // console.log("price.Cena:", element.Price);
        //  console.log("kurs.Kurs:", kurs.Kurs);
        //  console.log("kurs.Kratnost:", kurs.Kratnost);
      }

      return element;
    });
  }
  if (ostatki) {
    ostatki.forEach((ostatok: Ostatki) => {
      goods.forEach((element: Goods) => {
        if (element.NomCode === ostatok.NomCode) {
          const existingElement = goodsMap.get(element);
          if (existingElement) {
            existingElement[`Skl${ostatok.Sklad}`] = ostatok.quantity;
            existingElement[`Res${ostatok.Sklad}`] = ostatok.Rezerv;
          }
        }
      });
    });
  }
  if (
    body.UNP === "000000053" ||
    body.UNP === "000000054" ||
    body.UNP === "0000000055" ||
    body.UNP === "100511773"
  ) {
    console.log("ADD infotronic articles");
    const [data3, data4] = await Promise.all([
      axios.get("https://www.infotronic.by/api/public/Nom_Ost.json"),
      axios.get("https://www.infotronic.by/api/public/Nom_OST_PapkaInf.json"),
    ]);

    const response = await axios.get(
      "https://www.infotronic.by/assets/php/get1Ccatalog.php",
      {
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        },
      }
    );

    let infotronic1c = response.data?.value;
    response.data = [];
    let nomOst = data3.data;
    data3.data = [];
    let nomOstInf = data4.data;
    data4.data = [];
    let combinedNomOst = nomOst.concat(nomOstInf);
    nomOstInf = [];
    nomOst = [];

    combinedNomOst.forEach((item: Nom_Ost) => {
      const existingItem = goods.find((el: Goods) => el.NomCode === item.Code);

      if (!existingItem) {
        const newItem = new GoodsImpl();
        newItem.NomCode = item.Code;
        newItem.Articul = item.Articul;
        newItem.NomNaim = item.Naim;
        newItem.RoditelCode = item.RoditelCode;
        newItem.IsGropup = item.isGroup;
        newItem.Quantity = Number(item.Quantity);
        newItem.inCart = 0;
        newItem.slug = "";
        newItem.Akcionniy = "";
        newItem.Vigr7712 = "";
        newItem.ZapretProdazhiNARD = "";
        newItem.Price = "0";
        goods.push(newItem);
      }
    });

    goods = goods.map((element: Goods) => {
      const articul = combinedNomOst.find(
        (el: { Code: string }) => el.Code === element.NomCode
      );

      if (articul) {
        element.Articul = articul.Articul;
      }

      return element;
    });
    combinedNomOst = [];

    infotronic1c.forEach((info: infotronic1c) => {
      goods = goods.map((element: Goods) => {
        if (element.Articul === info.Артикул) {
          element.Ref_Key = info.Ref_Key;
        }
        return element;
      });
    });
    infotronic1c = [];
    nomOst = [];
    nomOstInf = [];
    combinedNomOst = [];
  }
  console.log(goods.length);

  prices.splice(0);
  ostatki.splice(0);
  pricesMain.splice(0);
  return goods;
});
