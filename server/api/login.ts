import axios from 'axios';
import fs from "fs/promises";
export default defineEventHandler(async (event) => {
  const credentials = await readBody(event);
  console.log('LOGIN API CALLED ', credentials);

  try {
    const url = `http://base.belca.by/UT/hs/Products/generatePassword/?Login=${credentials.Login}&password=${credentials.Password}`;
    const headers = {
      Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
    };

    const response = await axios.get(url, { headers });
    const data = response.data;
    console.log(data);
    let filePath = "";
    // Check if file exists
    if (process.env.NODE_ENV === "development") {
      filePath = "./public/LoginLog.JSON";
    } else {
      filePath =
        "/var/www/www-root/data/www/b2.belca.by/1c/LoginLog.JSON";
    }
    const logEntry = {
      Login: credentials.Login,
      Date: new Date().toISOString(),
    };
    try {
      await fs.appendFile(filePath, JSON.stringify(logEntry) + "\n", "utf-8");
      console.log("Login log written successfully");
    } catch (error) {
      console.error("Error writing login log:", error);
    }
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
});