import axios from "axios";
import fs from "fs/promises";

export default async () => {
  try {
    // code that might throw an error
    const response = await axios.get(
      "http://base.belca.by/UT/hs/Products/GetRealiz/",
      {
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        },
      }
    );
    let data = response.data;
    // process data
    // Check if file exists
    console.log("Get invoices API CALLED");
    const filePath = "./public/invoices.json";
    try {
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
      console.log("Invoices file written successfully");
      data = "";
    } catch (error) {
      data = "";
      console.error("Error writing invoices file:", error);
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};