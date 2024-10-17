import axios from "axios";
import fs from "fs/promises";

export default async () => {
  try {
    // code that might throw an error
    const response = await axios.get(
      "http://base.belca.by/UT/hs/Products/ost_tip_cen/",
      {
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        },
      }
    );
    let data = response.data;
    // process data
    // Check if file exists
    console.log("Get Prices API CALLED");
    const filePath = "./public/ost_tip_cen.json";
    try {
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
      console.log("Prices file written successfully");
      data = null;
    } catch (error) {
      console.error("Error writing Prices file:", error);
    }
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
};
