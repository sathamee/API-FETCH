const fetchData = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  
  const filterCountries = (data, query) => {
    return data.filter((country) => {
      const countryName = country.name.common.toLowerCase();
      const searchTerm = query.toLowerCase();
  
      return countryName.includes(searchTerm);
    });
  };
  
  const searchCountries = async (query, sortBy) => {
    const data = await fetchData();
    const filteredCountries = filterCountries(data, query);
  
    let sortedCountries;
    if (sortBy === "population") {
      sortedCountries = filteredCountries.sort(
        (a, b) => b.population - a.population
      );
    } else if (sortBy === "region") {
      sortedCountries = filteredCountries.sort((a, b) =>
        a.region.localeCompare(b.region)
      );
    } else {
      sortedCountries = filteredCountries.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
    }
  
    return sortedCountries;
  };
  
  const displayCountries = async (query, sortBy) => {
    const countries = await searchCountries(query, sortBy);
    const resultsContainer = document.querySelector("#results-container");
    const topTwoCountriesContainer = document.querySelector("#top-two-countries-container");
    resultsContainer.innerHTML = "";
    topTwoCountriesContainer.innerHTML = "";
  
    // Display the top two countries
    const topTwoCountries = countries.slice(0, 2);
    if (topTwoCountries.length > 0) {
      topTwoCountries.forEach((country) => {
        const population = country.population;
        const probability = Math.round((population / 7800000000) * 100);
        const countryName = country.name.common;
  
        const nameHTML = countryName.replace(
          new RegExp(query, "gi"),
          (match) => `<mark>${match}</mark>`
        );
  
        const resultHTML = `
          <div>
            <p>${nameHTML}</p>
            <p>Population: ${population}</p>
            <p>Probability: ${probability}%</p>
          </div>
        `;
  
        topTwoCountriesContainer.innerHTML += resultHTML;
      });
    }
  
    // Display the remaining countries
    if (countries.length > 2) {
      const otherCountries = countries.slice(2);
      const otherCountriesPopulation = otherCountries.reduce(
        (total, country) => total + country.population,
        0
      );
      const otherCountriesProbability = Math.round(
        (otherCountriesPopulation / 7800000000) * 100
      );
      const otherCountriesHTML = `
        <div>
          <p>Other countries:</p>
          <p>Population: ${otherCountriesPopulation}</p>
          <p>Probability: ${otherCountriesProbability}%</p>
        </div>
      `;
      resultsContainer.innerHTML += otherCountriesHTML;
    }
  };
  
  const searchInput = document.querySelector("#search-input");
  const sortSelect = document.querySelector("#sort-select");
  
  searchInput.addEventListener("input", () => {
    displayCountries(searchInput.value, sortSelect.value);
  });
  
  sortSelect.addEventListener("change", () => {
    displayCountries(searchInput.value, sortSelect.value);
  });
  
  displayCountries("", "");
  
