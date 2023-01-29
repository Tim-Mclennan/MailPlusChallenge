const companyName = document.querySelector('#companyName');
const email = document.querySelector('#email');
const phoneNumber = document.querySelector('#phoneNumber');
const addressBtn = document.querySelector('#addressBtn');
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
const form = document.getElementById("form");
const submit = document.getElementById('submit');
const table = document.getElementById('table');

// Loads the DataTable upon DOM render
document.addEventListener('DOMContentLoaded', function () {
    let dataTable = new DataTable('#table');
    submit.addEventListener('click', addRow);
    
    function addRow(event) {
        // prevent form submission
        event.preventDefault();

        //checking the validity of each required input
        if (!companyName.checkValidity()) {
            alert("Please enter a company name.");
        } else if (!email.checkValidity()) {
            alert("Please enter an email.");
        } else if (!phoneNumber.checkValidity()) {
            alert("Please enter a valid phone number that is ten digits long.");
        } else if (!address1.checkValidity()) {
            alert("Please enter a mailing address.");
        }  else {

        const companyNameTable = companyName.value;
        const emailTable = email.value;
        const phoneNumberTable = phoneNumber.value; 
        const addressTable = `<a href="http://maps.google.com/?q=${address1.value} ${address2.value}  ${city.value} ${state.value}  ${postcode.value}">${address1.value} ${address2.value}  ${city.value}  ${state.value}  ${postcode.value}</a>`
        actionTable = `<button id="addressBtn">Show Address</button> <button id="editBtn">Edit</button>  <button id="deleteBtn">Delete</button>`;
       
        // add data to DataTable
        const addedRow = dataTable.row.add([companyNameTable, emailTable, phoneNumberTable, actionTable]).draw().node();

        // Add child row containing address
        dataTable.row(addedRow).child(function() {
            return ("Mailing Address for " + companyNameTable + ": " + addressTable);
        }).hide();
        dataTable.on('click', '#addressBtn', function () {
            if (dataTable.row($(this).closest('tr')).child.isShown()) {
                dataTable.row($(this).closest('tr')).child.hide();
            } else {
                dataTable.row($(this).closest('tr')).child.show();
            }
        });
        
        //ability to remove row in DataTable:
        const deleteBtn = document.getElementById('deleteBtn');
        deleteBtn.addEventListener("click", (event) => {
            const tr = event.target.closest("tr");
            const row = dataTable.row(tr);
            row.remove().draw()    
        })
        // ability to edit row in DataTable and creates a save button:
        const editBtn = document.getElementById('editBtn');
        editBtn.addEventListener("click", (event) => {
            const row = event.target.parentNode.parentNode;
            const tds = row.querySelectorAll("td");
            tds.forEach(function(td) {
            const currentValue = td.innerText;
            td.innerHTML = `<input type="text" value="${currentValue}">`;
            });
            const saveBtn = document.createElement("button");
            saveBtn.innerHTML = "Save";
            saveBtn.classList.add("save");
            row.appendChild(saveBtn); 
            
            // Save Button
            saveBtn.addEventListener("click", (event) => {
                const row = event.target.parentNode;
                const inputs = row.querySelectorAll("input");
                inputs.forEach(function(input, index) {
                  const newValue = input.value;
                  const td = row.querySelectorAll("td")[index];
                  td.innerHTML = newValue;
                });
                event.target.remove();
            })
        })
        }
    }
 
});

// Google address autocomplete:
let autocomplete;
function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    autocomplete = new google.maps.places.Autocomplete(address1, {
    // addresses in Australia.
      componentRestrictions: { country: ["AU"] },
      fields: ["address_components", "geometry", 'name'],
      types: ["address"],
    });
    address2.focus();
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener("place_changed", fillInAddress);
  }

  function fillInAddress() {
    const place = autocomplete.getPlace();
    
  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  city.value = place.address_components[2].long_name;
  state.value = place.address_components[4].long_name;
  postcode.value = place.address_components[6].long_name;
  latitude.value = place.geometry.viewport.Ia.lo;
  longitude.value = place.geometry.viewport.Ya.lo;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
  address2.focus();
}