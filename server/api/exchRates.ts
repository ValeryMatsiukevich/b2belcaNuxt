export default defineEventHandler(async (event) => {
  fetch("http://base.belca.by/UT/hs/Products/Kursy/", {
    method: "GET",
    headers: {
      Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(JSON.stringify(data));
      return data;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
});
