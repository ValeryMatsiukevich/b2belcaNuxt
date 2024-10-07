import fs from "fs/promises";
export default async () => {
  try {
    // code that might throw an error
    const response = await fetch(
      "http://base.belca.by/UT/hs/Products/managers/",
      {
        method: "GET",
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        },
      }
    );
    const data = await response.json();
    // process data
    // Check if file exists
    console.log("Get Managers1C API CALLED");
    const filePath = "./public/managers.json";
    try {
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
      console.log("Managers file written successfully");
    } catch (error) {
      console.error("Error writing managers file:", error);
    }
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
};
