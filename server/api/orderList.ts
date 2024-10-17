import axios from "axios";

export default defineEventHandler(async (event) => {
  const credentials = await readBody(event);

  try {
    const response = await axios.get(
      `http://base.belca.by/UT/hs/Products/loadStatus/?UNP=${credentials.unp}`,
      {
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
});
