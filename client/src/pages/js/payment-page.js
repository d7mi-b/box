import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import request from '../../utility/request.js';

const header = document.querySelector("body > header:first-child");
header.innerHTML = Navbar();

document.body.innerHTML += Footer();

const id = location.href.split("?")[1].split("=")[1];

const iPayForm = document.getElementById("iPay-payment-form");

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


const handelGetShipment = (shipment) => {
    if (shipment.length === 0) {

        document.getElementsByClassName('content')[0].innerHTML = `
            <p class="not-found">لا توجد شحنة بهذا الرقم, تأكد من رقم الشحنة</p>
        `;

    } else {
        iPayForm.orderID.value = id;
        iPayForm.amount.value = '15000';
        renderShipment(shipment);
    }
}

const handelErrorGetShipment = () => {
    document.getElementsByClassName('content')[0].innerHTML = `
        <p class="not-found">حدث خطأ ما, حاول مرة أخرى</p>
    `;
}

function renderShipment (shipment) {
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
}

function getShipment () {
    request("GET", `http://localhost:8000/Box/server/APIs/shipments/shipment.php?id=${id}`, handelGetShipment, handelErrorGetShipment)
}

getShipment();

iPayForm.pay.addEventListener("click", async (e) => {
    e.preventDefault();

    const merchantAccountNumber = iPayForm.merchantAccountNumber.value;
    const merchantKey = iPayForm.merchantKey.value;
    const orderID = iPayForm.orderID.value;
    const amount = iPayForm.amount.value;
    const currancy = iPayForm.currancy.value
    
    const hash = await sha256(`${merchantAccountNumber}${merchantKey}${orderID}${amount}${currancy}`);
    iPayForm.hash.value = hash;
    
    if (hash)
        iPayForm.submit();
})

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}