import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import Alert from '../../components/Alert.js';

const header = document.querySelector("body > header:first-child");
header.innerHTML = Navbar();

document.body.innerHTML += Footer();

// START NEXT AND PREV BUTTONS SETTING #######-----------------------------------------------------------
const steps = document.querySelectorAll('.steps ol li');

const stepsForms = document.querySelectorAll(".request-shipment form > section");

const btnNext = document.querySelector('.switch-steps .next');
const btnPrev = document.querySelector('.switch-steps .prev');

let currentStep = 0;

btnNext.addEventListener('click', () => {
    if (currentStep < 2) {
        currentStep++;
        for (let i = 0; i < stepsForms.length; i++) {
            stepsForms[i].classList.remove('active');
        }
        for (let i = 0; i < steps.length; i++) {
            steps[i].classList.remove('active');
        }

        stepsForms[currentStep].classList.add('active');
        steps[currentStep].classList.add('active');
    }

    if (currentStep === 2) {
        getCoordinates(requestForm.from.value, requestForm.to.value);
    }
});

btnPrev.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        for (let i = 0; i < stepsForms.length; i++) {
            stepsForms[i].classList.remove('active');
        }
        for (let i = 0; i < steps.length; i++) {
            steps[i].classList.remove('active');
        }

        stepsForms[currentStep].classList.add('active');
        steps[currentStep].classList.add('active');
    }
})
// END NEXT AND PREV BUTTONS SETTING #######-----------------------------------------------------------

// START GET CITIES AND CATEGORIES #######--------------------------------------------------------------
getCities();
getCategories();

function getCities () {
    const http = new XMLHttpRequest();

    http.onload = () => {
        if (http.status === 200) {
            const result = JSON.parse(http.responseText);

            const selectsCity = document.querySelectorAll('select.city');

            selectsCity.forEach(select => {
                result.forEach(e => {
                    const option = document.createElement('option');
                    option.value = e.id;
                    option.innerText = e.city;

                    option.onclick = () => {
                        select.value = option.value;
                    }
                    select.appendChild(option);
                })
            })
        }
    }

    http.open("GET", "http://localhost:2000/Box/server/APIs/cities/cities.php");
    http.setRequestHeader("Content_Type", "application/json");
    http.send();
}

function getCategories () {
    const http = new XMLHttpRequest();

    http.onload = () => {
        if (http.status === 200) {
            const result = JSON.parse(http.responseText);

            const select = document.querySelector('select[name = "category_id"]');

            result.forEach(e => {
                const option = document.createElement('option');
                option.value = e.id;
                option.innerText = e.category;

                option.onclick = () => {
                    select.value = option.value;
                }
                select.appendChild(option);
            })
        }
    }

    http.open("GET", "http://localhost:2000/Box/server/APIs/categories/categories.php");
    http.setRequestHeader("Content_Type", "application/json");
    http.send();
}
// END GET CITIES AND CATEGORIES #######--------------------------------------------------------------

// START POST SHIPMENT #######-----------------------------------------------------------
const requestForm = document.forms[0];

requestForm.addEventListener('submit', e => {
    e.preventDefault();

    const http = new XMLHttpRequest();

    http.onload = () => {
        if (http.status === 201) {
            const {id} = JSON.parse(http.responseText);

            document.body.innerHTML += Alert(true, "تم إضافة طلبك", id);
            const btnContaniue = document.querySelector('.alert button');

            btnContaniue.addEventListener('click', () => {
                location.assign(`http://localhost:2000/Box/client/src/pages/shipment.html?id=${id}`);
            });
        } else {
            const { message } = JSON.parse(http.responseText);

            document.body.innerHTML += Alert(false, message);
            const btnContaniue = document.querySelector('.alert button');

            btnContaniue.addEventListener('click', () => {
                document.getElementsByClassName('alert')[0].remove();
            });
        }
    };

    http.open("POST", "http://localhost:2000/Box/server/APIs/shipments/add.php");
    http.send(new FormData(requestForm));
});
// END POST SHIPMENT #######-----------------------------------------------------------

// START GET LATITUDE AND LONGITUDE (COORDINATES) OF LOCATION ###########-----------------------------------------------------
function getCoordinates (city1, city2) {
    const http = new XMLHttpRequest();

    http.onload = () => {
        if (http.status === 200) {
            const coordinates = JSON.parse(http.responseText);

            const distance = calcCrow(
                coordinates[0].latitude,
                coordinates[0].longitude,
                coordinates[1].latitude,
                coordinates[1].longitude,
            );
            
            requestForm.price.value = (distance * 10000).toFixed(2);
        }
    }

    http.open("GET", `http://localhost:2000/Box/server/APIs/cities/coordinates.php?city1=${city1}&city2=${city2}`);
    http.send();
}
// END GET LATITUDE AND LONGITUDE (COORDINATES) OF LOCATION ###########-----------------------------------------------------

// CALCULATE DESTANCE ###########-----------------------------------------------------
//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}