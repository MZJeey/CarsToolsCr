async function obtenerPais() {
  let response = await fetch(`https://restcountries.com/v3.1/all`);
  let data = await response.json();

  data.forEach((pais) => {
    console.log(`País: ${pais.name.common}`);
    console.log(`Región: ${pais.region}`);
    console.log(`Capital: ${pais.capital}`);
    console.log(`Población: ${pais.population}`);
  });
}

obtenerPais("costa rica");
