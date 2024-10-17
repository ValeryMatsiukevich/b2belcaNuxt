import axios from 'axios';
import fs from "fs/promises";

export default async () => {
  try {
    // code that might throw an error
    const response = await axios.get(
      "http://base.belca.by/UT/hs/Products/nom1c8b2b/",
      {
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        }
      }
    );
    let data = response.data;
    // process data
    // Check if file exists
    console.log("CATALOG API CALLED");
    const filePath = "./public/nom1c8b2b.json";
    try {
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
      console.log("Catalog file written successfully");
      data = null;
    } catch (error) {
      data = null;
      console.error("Error writing Catalog file:", error);
    }
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
};