import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import Alert from "../../components/Alert.js";
import request from "../../utility/request.js";
import btnDeleteEvent from '../../utility/btnDeleteEvent.js';

const header = document.querySelector("body > header:first-child");
header.innerHTML = Navbar();

document.body.innerHTML += Footer();

const id = location.href.split("?")[1].split("=")[1];

const shipment_id = document.getElementsByName('id')[0];
const category = document.getElementsByName('category')[0];
const from = document.getElementsByName('from')[0];
const to = document.getElementsByName('to')[0];
const date_of_shipment = document.getElementsByName('date_of_shipment')[0];
const quantity = document.getElementsByName('quantity')[0];
const stage = document.getElementsByName('stage')[0];
const owner_name = document.getElementsByName('owner_name')[0];
const owner_email = document.getElementsByName('owner_email')[0];
const owner_phone = document.getElementsByName('owner_phone')[0];
const price = document.getElementsByName('price')[0];
const receipt = document.getElementsByName('receipt')[0];

const updateForm = document.forms[0];
updateForm.shipment_id.value = id;

// ###### START HANDEL REQUEST FUNCTIONS ---------------------------------------------------
// ###### START HANDEL REQUEST FUNCTIONS ---------------------------------------------------
const handelGetShipment = (shipment) => {
    shipment_id.innerText = shipment[0].id;
    from.innerHTML = `
            <p>${shipment[0].city}</p>
            <div>
                <!-- Google Map Copied Code -->
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3861.9914780310255!2d${shipment[0].longitude}!3d${shipment[0].latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDMyJzMyLjkiTiA0OcKwMDcnMjcuMyJF!5e0!3m2!1sar!2s!4v1701161169329!5m2!1sar!2s"
                    width="200" height="100" style="border:0;" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        `;
    to.innerHTML = `
            <p>${shipment[shipment.length - 1].city}</p>
            <div>
                <!-- Google Map Copied Code -->
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3861.9914780310255!2d${shipment[shipment.length - 1].longitude}!3d${shipment[shipment.length - 1].latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDMyJzMyLjkiTiA0OcKwMDcnMjcuMyJF!5e0!3m2!1sar!2s!4v1701161169329!5m2!1sar!2s"
                    width="200" height="100" style="border:0;" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        `;
    category.innerText = shipment[0].category;
    date_of_shipment.innerText = shipment[0].date_of_shipment.split(' ')[0];
    quantity.innerText = shipment[0].quantity;
    stage.innerText = shipment[0].stage;
    owner_name.innerText = shipment[0].owner_name;
    owner_email.innerText = shipment[0].owner_email;
    owner_phone.innerText = shipment[0].owner_phone;
    price.innerText = shipment[0].price;
    receipt.innerHTML = `
            <a href="${shipment[0].image.substr(15)}" target="_blank"><img src="${shipment[0].image.substr(15)}" alt="receipt"></a>
    `;
    updateForm.stage.value = shipment[0].stage;
    updateForm.truck_id.value = shipment[0].truck_id;
}

const handelGetTrucks = (trucks) => {
    const selectsTruck = document.querySelectorAll('select[name = "truck_id"]');

    selectsTruck.forEach(select => {
        trucks.forEach(e => {
            const option = document.createElement('option');
            option.value = e.id;
            option.innerText = e.number;

            option.onclick = () => {
                select.value = option.value;
            }
            select.appendChild(option);
        })
    })
}

const handelDeleteShipment = () => {
    document.body.appendChild(Alert(true, "تم حذف الشحنة"));

    const btnClose = document.querySelector('.alert .btn-container:first-of-type .btn');

    btnClose.onclick = () => {
        btnClose.parentElement.parentElement.parentElement.remove();
    }

    const btnContinue = document.querySelectorAll('.alert .btn')[document.querySelectorAll('.alert .btn').length - 1];

    btnContinue.onclick = () => {
        location.replace('/Box/client/src/pages/shipments.html');
    }
}

function getShipment() {
    request("GET", `http://localhost:2000/Box/server/APIs/shipments/shipment.php?id=${id}`, handelGetShipment);
}

function getTrucks() {

    request("GET", "http://localhost:2000/Box/server/APIs/trucks/trucks.php", handelGetTrucks);
};

getShipment();
getTrucks();

updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const http = new XMLHttpRequest();
    
    http.onload = () => {
        console.log(http.responseText)
    }

    request(http, "POST", "http://localhost:2000/Box/server/APIs/shipments/update.php", new FormData(updateForm));
})

const btnDelete = document.querySelector('.shipment header button');
const deleteAPI = `http://localhost:2000/Box/server/APIs/shipments/delete.php?id=${id}`;

btnDeleteEvent(btnDelete, "هل انت متأكد من حذف الشحنة", deleteAPI, handelDeleteShipment)
