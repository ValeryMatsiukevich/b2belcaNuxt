import axios from 'axios';
import fs from "fs/promises";

export default async () => {
  try {
    // code that might throw an error
    let response = await axios.get(
      "http://base.belca.by/UT/hs/Products/Balance/",
      {
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        }
      }
    );
    let data = response.data;
    // process data
    // Check if file exists
    console.log("Get balance API CALLED");
    const filePath = "./public/balance.json";
    try {
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
      data = "";
      console.log("Balance file written successfully");
    } catch (error) {
      data = "";
      console.error("Error writing balance file:", error);
    }  finally {
      data = ""; // очистка переменной data
      (response as any) = "";
    }
    
  } catch (error) {
    console.error(error);
    
    return new Response("Error processing request", { status: 500 });
  }
};