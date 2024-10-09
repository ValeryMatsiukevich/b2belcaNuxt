export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const url = `http://base.belca.by/UT/hs/Products/uploadOrder/?UNP=${body.UNP}&Comment=${body.Comment}`;
    const headers = {
      Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
    };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    console.log(JSON.stringify(data));
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
});