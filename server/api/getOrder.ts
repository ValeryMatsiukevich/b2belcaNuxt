import axios from "axios";

export default defineEventHandler(async (event) => {
  const credentials = await readBody(event);

  try {
    const url = `http://base.belca.by/UT/hs/Products/GetTablZak/?Zakaz=${credentials.order}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
});
