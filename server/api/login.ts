import axios from "axios";

export default defineEventHandler(async (event) => {
  const credentials = await readBody(event);

  try {
    //console.log(credentials.Login, credentials.Password);

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://base.belca.by/UT/hs/Products/generatePassword/?Login=${credentials.Login}&password=${credentials.Password}`,
      headers: {
        Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
      },
    };

    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
});
