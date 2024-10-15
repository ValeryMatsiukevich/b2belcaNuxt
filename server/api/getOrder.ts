export default defineEventHandler(async (event) => {
  const credentials = await readBody(event);

  try {
    const url = `http://base.belca.by/UT/hs/Products/GetTablZak/?Zakaz=${credentials.order}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
});