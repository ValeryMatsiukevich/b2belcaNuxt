export default defineEventHandler(async (event) => {
  const credentials = await readBody(event);

  try {
    const response = await fetch(`http://base.belca.by/UT/hs/Products/loadStatus/?UNP=${credentials.unp}`, {
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