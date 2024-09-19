import axios from "axios";

export default defineEventHandler(async (event) => {
 

  try {
    

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://base.belca.by/UT/hs/Products/Kursy/`,
      headers: {
        Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
      },
    };

    const response = await axios.request(config);
    //console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
});
