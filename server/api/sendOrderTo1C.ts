import fs from "fs/promises";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const url = `http://base.belca.by/UT/hs/Products/uploadOrder/?UNP=${body.UNP}&Comment=${body.Comment}`;
    const headers = {
      Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
    };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    console.log(JSON.stringify(data));
    let filePath = "";
    // Check if file exists
    if (process.env.NODE_ENV === "development") {
      filePath = "./public/Orders/" + body.UNP + ".JSON";
    } else {
      filePath =
        "/var/www/www-root/data/www/b2.belca.by/Orders/" + body.UNP + ".JSON";
    }
    // Переименовать файл
    const newFilePath = filePath.replace(body.UNP + ".JSON", body.UNP + ".BAK");
    fs.rename(filePath, newFilePath);

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
});
