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

  if (body.spec) {
    //  console.log(body.spec);
    let pricesSpec = prices.filter(
      (el: { TipCenCode: string }) => el.TipCenCode === body.spec
    );
    goods = goods.map((element: Goods) => {
      const price = pricesSpec.find(
        (el: { NomCode: string }) => el.NomCode === element.NomCode
      );

      if (price) {
        let kurs = kursyRaw.find((el: Kursy) => el.Valuta === price.ValutaCode);

        if (kurs.Kratnost !== 0) {
          element.Price = (
            Math.round(
              ((price.Cena.replace(",", ".") * kurs.Kurs) / kurs.Kratnost) * 100
            ) / 100
          ).toString();
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
  if (
    body.UNP === "0000000053" ||
    body.UNP === "0000000054" ||
    body.UNP === "0000000055" ||
    body.UNP === "100511773"
  ) {
    console.log("ADD infotronic articles");
    const [data3, data4] = await Promise.all([
      axios.get("https://www.infotronic.by/api/public/Nom_Ost.json"),
      axios.get("https://www.infotronic.by/api/public/Nom_OST_PapkaInf.json", {
        responseType: "text",
      }),
    ]);
    const response = await axios.get(
      "https://www.infotronic.by/assets/php/get1Ccatalog.php",
      {
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        },
      }
    );
    let infotronic1c = response.data.value;
    let nomOst = data3.data;
    let nomOstInf = data4.data;
    let combinedNomOst = nomOst.concat(nomOstInf);

    combinedNomOst.forEach((item: Nom_Ost) => {
      const existingItem = goods.find((el: Goods) => el.NomCode === item.Code);

      if (!existingItem) {
        const newItem: Goods = {
          NomCode: item.Code,
          Articul: item.Articul,
          NomNaim: item.Naim,
          RoditelCode: item.RoditelCode,
          IsGropup: item.isGroup,
          Quantity: item.Quantity,
          inCart: 0,
        };
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

    infotronic1c.forEach((info: infotronic1c) => {
      goods = goods.map((element: Goods) => {
        if (element.Articul === info.Артикул) {
          element.Ref_Key = info.Ref_Key;
        }
        return element;
      });
    });
    
  }

  console.log(goods.length);
  return goods;
});
