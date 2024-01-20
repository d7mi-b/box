import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import Alert from '../../components/Alert.js';
import request from '../../utility/request.js';
import btnDeleteEvent from '../../utility/btnDeleteEvent.js';

const SERVER = `http://localhost:8000/Box/server/APIs`;

const header = document.querySelector("body > header:first-child");
header.innerHTML = Navbar();

document.body.innerHTML += Footer();

let drivers;

const renderTrauck = (trucks) => {
    const tableBody = document.querySelector("table tbody");

    trucks.forEach(truck => {
        appendTruck(tableBody, truck);
    })
}

function getTrucks() {
    request("GET", `${SERVER}/trucks/trucks.php`, renderTrauck);
}

getTrucks();

const sectionFrom = document.querySelector('.form');
const formAdd = document.forms[0];
const btnAdd = document.querySelector('.page > header .btn');
const btnClose = document.querySelector('.form > header .btn');

btnAdd.addEventListener('click', () => {
    sectionFrom.style.display = 'block';
});

btnClose.addEventListener('click', () => {
    sectionFrom.style.display = 'none';
});

// ######## START HANDEL REQUEST FUNCTIONS ----------------------------------------------------------------------------
const handelGetDrivers = (result) => {
    drivers = result;
}

const handelAddTruck = (truck) => {
    console.log(truck);
    const tbody = document.querySelector('table tbody');

    appendTruck(tbody, truck);

    sectionFrom.style.display = 'none';

    document.body.appendChild(Alert(true, "تم إضافة الشاحنة"));
    const btnContaniue = document.querySelector('.alert .btn-container:last-of-type button');

    btnContaniue.addEventListener('click', () => {
        document.querySelector('.alert').remove();
    });
}

const handelUpdateTruck = (truck) => {
    const num = document.querySelector(`.truck-${truck.id} > td:first-child`);
    num.innerText = truck.number;

    const capacity = document.querySelector(`.truck-${truck.id} td:nth-of-type(2)`);
    capacity.innerText = truck.capacity;

    const status = document.querySelector(`.truck-${truck.id} td:nth-of-type(3)`);
    status.innerText = truck.status;

    const name = document.querySelector(`.truck-${truck.id} td:nth-of-type(4)`);
    name.innerText = truck.name;

    const formUpdate = document.querySelector(`.truck-${truck.id} + tr > td`);
    formUpdate.style.display = "none";

    document.body.appendChild(Alert(true, "تم تحديث معلومات الشاحنة"));
    
    const btnContaniue = document.querySelector('.alert .btn-container:last-of-type button');

    btnContaniue.addEventListener('click', () => {
        document.querySelector('.alert').remove();
    });
}

const handelDeleteTruck = (truck) => {
    document.body.appendChild(Alert(true, "تم حذف الشاحنة"));

    const btnClose = document.querySelector('.alert .btn-container:first-of-type .btn');

    btnClose.onclick = () => {
        btnClose.parentElement.parentElement.parentElement.remove();
    }

    const btnContinue = document.querySelectorAll('.alert .btn')[document.querySelectorAll('.alert .btn').length - 1];

    btnContinue.onclick = () => {
        document.querySelector(`.truck-${truck.id} + tr`).remove();
        document.querySelector(`.truck-${truck.id}`).remove();

        const alerts = document.querySelectorAll(`.alert`);

        alerts.forEach(e => {
            e.remove();
        })
    }
}
// ######## START HANDEL REQUEST FUNCTIONS ----------------------------------------------------------------------------

const getDrivers = () => {
    request("GET", `${SERVER}/drivers/drivers.php`, handelGetDrivers);
}

getDrivers();

formAdd.addEventListener('submit', (e) => {
    e.preventDefault();

    request("POST", "${SERVER}/trucks/add.php", handelAddTruck, null, new FormData(formAdd));
})

function appendTruck(tbody, truck) {
    const row = document.createElement('tr');
    row.className = `truck-${truck.id}`;

    const num = document.createElement('td');
    num.innerText = truck.number;

    const capacity = document.createElement('td');
    capacity.innerText = truck.capacity;

    const status = document.createElement('td');
    status.innerText = truck.status;

    const driver = document.createElement('td');
    driver.innerText = truck.name ? truck.name : "لا يوجد سائق";

    const btnContainer = document.createElement('td');
    btnContainer.className = "btn-container center";

    const btnUpdate = document.createElement('button');
    btnUpdate.className = `btn center btnUpdate-${truck.id}`;
    btnUpdate.innerHTML = '<i class="fa-solid fa-pen"></i>';

    const btnDelete = document.createElement('button');
    btnDelete.className = `btn center btnDelete-${truck.id}`;
    btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';

    btnContainer.appendChild(btnUpdate);
    btnContainer.appendChild(btnDelete);

    row.appendChild(num);
    row.appendChild(capacity);
    row.appendChild(status);
    row.appendChild(driver);
    row.appendChild(btnContainer);

    tbody.appendChild(row);

    const rowForm = document.createElement('tr');
    const columnForm = document.createElement('td');
    columnForm.colSpan = "5";

    columnForm.innerHTML = renderUpdateForm(truck);
    columnForm.className = `update-td form update-${truck.id}`;

    btnEvents(btnUpdate, btnDelete, columnForm, truck);

    rowForm.appendChild(columnForm);

    tbody.appendChild(rowForm);
}

function btnEvents(btnUpdate, btnDelete, columnFormormUpdate, truck) {
    btnUpdate.addEventListener('click', () => {
        const btnClose = document.querySelector(`.update-${truck.id} > header .btn`);
        btnClose.onclick = () => {
            columnFormormUpdate.style.display = "none";
        }

        const formUpdate = document.querySelector(`.update-${truck.id} form`);

        columnFormormUpdate.style.display = 'table-cell';

        formUpdate.addEventListener('submit', (e) => {
            e.preventDefault();

            request("POST", `${SERVER}/trucks/update.php`, handelUpdateTruck, null, new FormData(formUpdate));
        });
    });

    const deleteAPI = `${SERVER}/trucks/delete.php?id=${truck.id}`;

    btnDeleteEvent(btnDelete, "هل انت متأكد من حذف الشاحنة", deleteAPI, handelDeleteTruck);
}

function renderUpdateForm(truck) {
    return `
        <header>
            <h2><i class="fa-solid fa-truck"></i> تعديل بيانات الشاحنة رقم ${truck.number}</h2>
    
            <section class="btn-container">
                <button class="btn center"><i class="fa-solid fa-close"></i></button>
            </section>
        </header>
    
        <form>
            <input type="hidden" name="id" readonly value="${truck.id}">
            <div>
                <label for="number"><i class="fa-solid fa-truck"></i> رقم الشاحنة</label>
                <input type="text" name="number" value="${truck.number}">
            </div>
            <div>
                <label for="capacity"><i class="fa-solid fa-truck"></i> سعة الشاحنة</label>
                <input type="text" name="capacity" value="${truck.capacity}">
            </div>
            <div>
                <label for="status"><i class="fa-solid fa-truck"></i> حالة الشاحنة</label>
                <select name="status">
                    <option ${truck.status === "متوقفة عن العمل" ? "selected" : ''} value="متوقفة عن العمل"> متوقفة عن العمل</option>
                    <option ${truck.status === "في انتظار شحنة" ? "selected" : ''} value="في انتظار شحنة"> في انتظار شحنة</option> 
                    <option ${truck.status === "في طريقها لتوصيل شحنة" ? "selected" : ''} value="في طريقها لتوصيل شحنة"> في طريقها لتوصيل شحنة</option> 
                    <option ${truck.status === "متفرغة" ? "selected" : ''} value="متفرغة"> متفرغة</option> 
                </select>
            </div>
            <div>
                <label for="status"><i class="fa-solid fa-user"></i> سائق الشاحنة</label>
                <select name="drivers">
                    <option value=${null}>لا يوجد سائق</option>
                    ${
                        drivers && drivers.map(driver => {
                            return `
                                <option ${truck.driver_id === driver.id ? "selected" : ""} value="${driver.id}">${driver.name}</option>
                            `;
                        })
                    }
                </select>
            </div>
            <div class="btn-container center">
                <input class="btn" type="submit" name="submit" value="حفظ">
            </div>    
        </form>
    `;
}