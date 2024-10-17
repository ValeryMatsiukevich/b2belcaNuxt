import axios from 'axios';

export default defineEventHandler(async (event) => {
  try {
    const { data } = await axios.get('http://base.belca.by/UT/hs/Products/Kursy/', {
      headers: {
        Authorization: 'Basic QW5kcmV5RXNvZGluOjE=',
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
});