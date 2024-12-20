import fs from "fs/promises";
export default async () => {
  try {
    // code that might throw an error
    const response = await fetch(
      "http://base.belca.by/UT/hs/Products/Kontragents_New/",
      {
        method: "GET",
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        },
      }
    );
    let data = await response.json();
    // process data
    // Check if file exists
    console.log("Get Managers1C API CALLED");
    const filePath = "./public/kontragents_new.json";
    try {
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
      console.log("Contragents file written successfully");
      data="";
    } catch (error) {
      data = "";
      console.error("Error writing contragents file:", error);
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};
