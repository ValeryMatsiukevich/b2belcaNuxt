import axios from 'axios';

export default defineEventHandler(async (event) => {
  console.log("Inforonic orders API called");

  let response;

  try {
    response = await axios.get('https://www.infotronic.by/assets/php/getOrdersList.php', {
      headers: {
        Authorization: 'Basic QW5kcmV5RXNvZGluOjE=',
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data.value;
  } catch (error) {
    console.log(error);
    return [];
  } finally {
    response = [];
  }
});