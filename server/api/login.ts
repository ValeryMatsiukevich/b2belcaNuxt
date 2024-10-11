export default defineEventHandler(async (event) => {
  
  const credentials = await readBody(event);
  console.log('LOGIN API CALLED ',credentials); 
  try {
    const url = `http://base.belca.by/UT/hs/Products/generatePassword/?Login=${credentials.Login}&password=${credentials.Password}`;
    const headers = {
      Authorization: "Basic QW5kcmV5RXNvZGluOjE=",
    };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
});