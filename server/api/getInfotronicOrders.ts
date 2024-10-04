import axios from "axios";

export default defineEventHandler(async (event) => {
  console.log("Inforoinic orders API called"); 
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://www.infotronic.by/assets/php/getOrdersList.php",
      headers: {
        Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
      },
    };
    
    const response = await axios.request(config);
    // console.log(JSON.stringify(response.data.value));
    return response.data.value;
  } catch (error) {
    console.log(error);
    return [];
  }
});
