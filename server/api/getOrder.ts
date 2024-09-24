import axios from "axios";

export default defineEventHandler(async (event) => {
  const credentials = await readBody(event);

  try {
     let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://base.belca.by/UT/hs/Products/GetTablZak/?Zakaz=${credentials.order}`,
      headers: {
        Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
      },
    };

    const response = await axios.request(config);
    // console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
});
