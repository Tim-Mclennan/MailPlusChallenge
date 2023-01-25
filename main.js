const addressBtn = document.querySelector('#addressBtn');
const companyName = document.querySelector('#companyName');
const email = document.querySelector('#email');
const phoneNumber = document.querySelector('#phoneNumber');
const address1 = document.querySelector('#address1');
const address2 = document.querySelector('#address2');
const city = document.querySelector('#city');
const state = document.querySelector('#state');
const postcode = document.querySelector('#postcode');
const latitude = document.querySelector('#latitude');
const longitude = document.querySelector('#longitude');

//function that finds location.
const findLocation = () => {
    const status = document.querySelector('#status');
    const success = (position) => {
        const latitudeNum = position.coords.latitude;
        const longitudeNum = position.coords.longitude;

        // Google Maps API for determining the locations City, State and Postcode:
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitudeNum + ',' + longitudeNum + '&key=AIzaSyA-8dnFX89BO9uBu1ciqpbcqRGg61fG4fs';

        fetch(url)
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        const streetNum = data.results[0].address_components[0].long_name;
        const streetName = data.results[0].address_components[1].long_name;
        const cityName = data.results[0].address_components[2].long_name;
        const stateName = data.results[0].address_components[4].long_name;
        const postcodeNum = data.results[0].address_components[6].long_name;
        address1.value = (streetNum + ' ' + streetName);
        city.value = cityName;
        state.value = stateName;
        postcode.value = postcodeNum;
        latitude.value = latitudeNum;
        longitude.value = longitudeNum;
        });
    }
    const error = () => {
        status.textContext = 'Unable to retrieve location';
    }

    // gets an object containing location data. Both parameters will be expanded in the above functions.
    navigator.geolocation.getCurrentPosition(success, error);    
}
addressBtn.addEventListener('click', findLocation);


// DataTable
const table = document.getElementById('table');
let editor;

//event listener for the submit button
const submit = document.getElementById('submit');

// Loads the DataTable upon DOM render
document.addEventListener('DOMContentLoaded', function () {
    let dataTable = new DataTable('#table');
    submit.addEventListener('click', addRow);
    
    function addRow(event) {
        // prevent form submission
        event.preventDefault();

        const companyNameTable = companyName.value;
        const emailTable = email.value;
        const phoneNumberTable = phoneNumber.value; 
        const addressTable = `<a href="http://maps.google.com/?q=${address1.value} ${address2.value}  ${city.value} ${state.value}  ${postcode.value}">${address1.value} ${address2.value}  ${city.value}  ${state.value}  ${postcode.value}</a>`
        actionTable = `<button class="editBtn">Edit</button>  <button class="deleteBtn">Delete</button>`;
        // add data to DataTable
        dataTable.row.add([companyNameTable, emailTable, phoneNumberTable, addressTable, actionTable]).draw();
    }

    //removes row in DataTable:
    table.addEventListener("click", (event) => {
        if (event.target.classList.contains("deleteBtn")) {
            const tr = event.target.closest("tr");
            const row = dataTable.row(tr);
            row.remove().draw();
        }
        // Edits row in DataTable:
        if (event.target.classList.contains("editBtn")) {
            const row = event.target.parentNode.parentNode;
            const tds = row.querySelectorAll("td");
            tds.forEach(function(td) {
            const currentValue = td.innerHTML;
            td.innerHTML = `<input type="text" value="${currentValue}">`;
            });
            const saveBtn = document.createElement("button");
            saveBtn.innerHTML = "Save";
            saveBtn.classList.add("save");
            row.appendChild(saveBtn);
        } // implements the save button
        else if (event.target.classList.contains("save")) {
            const row = event.target.parentNode;
            const inputs = row.querySelectorAll("input");
            inputs.forEach(function(input, index) {
              const newValue = input.value;
              const td = row.querySelectorAll("td")[index];
              td.innerHTML = newValue;
            });
            event.target.remove();
        }
    });

});

