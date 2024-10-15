export default defineEventHandler(async (event) => {
  console.log("Inforonic orders API called");

  try {
    const response = await fetch(
      "https://www.infotronic.by/assets/php/getOrdersList.php",
      {
        headers: {
          Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.log(error);
    return [];
  }
});