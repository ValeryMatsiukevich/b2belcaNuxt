import fs from "fs/promises";
export default async () => {
  try {
    // code that might throw an error
    const response = await fetch(
      "http://base.belca.by/UT/hs/Products/ost8skl/",
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
    console.log("ost8skl API CALLED");
    const filePath = "./public/ost8skl.json";
    try {
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
      console.log("ost8skl file written successfully");
    } catch (error) {
      console.error("Error writing ost8skl file:", error);
    }
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
};
