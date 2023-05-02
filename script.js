// create elements
const container = document.createElement('div');
container.classList.add('container', 'my-3');

const heading = document.createElement('h1');
heading.textContent = 'Search Countries';

const formGroup1 = document.createElement('div');
formGroup1.classList.add('form-group');

const input = document.createElement('input');
input.classList.add('form-control');
input.setAttribute('type', 'text');
input.setAttribute('id', 'search-input');
input.setAttribute('placeholder', 'Search for a country...');

formGroup1.appendChild(input);

const formGroup2 = document.createElement('div');
formGroup2.classList.add('form-group');

const select = document.createElement('select');
select.classList.add('form-control');
select.setAttribute('id', 'filter-select');

const option1 = document.createElement('option');
option1.setAttribute('value', '');
option1.textContent = 'All';
const option2 = document.createElement('option');
option2.setAttribute('value', 'name');
option2.textContent = 'Name';
const option3 = document.createElement('option');
option3.setAttribute('value', 'region');
option3.textContent = 'Region';
const option4 = document.createElement('option');
option4.setAttribute('value', 'subregion');
option4.textContent = 'Subregion';

select.appendChild(option1);
select.appendChild(option2);
select.appendChild(option3);
select.appendChild(option4);

formGroup2.appendChild(select);

const searchResults = document.createElement('ul');
searchResults.setAttribute('id', 'search-results');

container.appendChild(heading);
container.appendChild(formGroup1);
container.appendChild(formGroup2);
container.appendChild(searchResults);

// append to body
document.body.appendChild(container);

// include script
const script = document.createElement('script');
script.setAttribute('src', 'script.js');
document.body.appendChild(script);

const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const searchResults = document.getElementById('search-results');

async function getCountriesData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function highlightText(text, query) {
    const regex = new RegExp(query, 'gi');
    return text.replace(regex, match => `<mark>${match}</mark>`);
}

function filterCountries(countries, query, filter) {
    return countries.filter(country => {
        const searchIn = filter || 'name';
        const searchText = country[searchIn]?.common.toLowerCase() || '';
        return searchText.includes(query);
    });
}

async function searchCountries() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const countriesData = await getCountriesData();
    const filteredData = filterCountries(countriesData, searchTerm, filterValue);
    const sortedData = filteredData.sort((a, b) => {
        return b.population - a.population;
    });
    const topTwoData = sortedData.slice(0, 2);
    const probability = (topTwoData[0].population / topTwoData[1].population * 100).toFixed(2);
    const searchResultsHtml = topTwoData.map(country => {
        const highlightedName = highlightText(country.name.common, searchTerm);
        const highlightedRegion = highlightText(country.region, searchTerm);
        const highlightedSubregion = highlightText(country.subregion, searchTerm);
        return `<li><strong>${highlightedName}</strong> - ${highlightedRegion} - ${highlightedSubregion} - Population: ${country.population}</li>`;
    }).join('');
    searchResults.innerHTML = searchResultsHtml;
    document.getElementById('probability').textContent = probability;
}

searchInput.addEventListener('input', searchCountries);
filterSelect.addEventListener('change', searchCountries);
