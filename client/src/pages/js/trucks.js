import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import Alert from '../../components/Alert.js';
import request from '../../utility/request.js';
import btnDeleteEvent from '../../utility/btnDeleteEvent.js';

const header = document.querySelector("body > header:first-child");
header.innerHTML = Navbar();

document.body.innerHTML += Footer();

const renderTrauck = (trucks) => {
    const tableBody = document.querySelector("table tbody");

    trucks.forEach(truck => {
        appendTruck(tableBody, truck);
    })
}

function getTrucks() {
    request("GET", `http://localhost:2000/Box/server/APIs/trucks/trucks.php`, renderTrauck);
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

const handelAddTruck = (truck) => {
    console.log(truck);
    const tbody = document.querySelector('table tbody');

    appendTruck(tbody, truck);

    sectionFrom.style.display = 'none';

    document.body.innerHTML += Alert(true, "تم إضافة الشاحنة");
    const btnContaniue = document.querySelector('.alert .btn-container:last-of-type button');

    btnContaniue.addEventListener('click', () => {
        document.querySelector('.alert').remove();
    });
}

const handelUpdateTruck = (truck) => {
    console.log(truck);
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

formAdd.addEventListener('submit', (e) => {
    e.preventDefault();

    request("POST", "http://localhost:2000/Box/server/APIs/trucks/add.php", handelAddTruck, null, new FormData(formAdd));
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

            request("POST", "http://localhost:2000/Box/server/APIs/trucks/update.php", handelUpdateTruck, null, new FormData(formUpdate));
        });
    });

    const deleteAPI = `http://localhost:2000/Box/server/APIs/trucks/delete.php?id=${truck.id}`;

    btnDeleteEvent(btnDelete, "هل انت متأكد من حذف السائق", deleteAPI, handelDeleteTruck);
}

function renderUpdateForm(truck) {
    return `
        <header>
            <h2><i class="fa-solid fa-truck"></i> تعديل بيانات ${truck.number}</h2>
    
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
                <select name="status" value="${truck.status}">
                    <option value="متوقفة عن العمل"> متوقفة عن العمل</option>
                    <option value="في انتظار شحنة"> في انتظار شحنة</option> 
                    <option value="في طريقها لتوصيل شحنة"> في طريقها لتوصيل شحنة</option> 
                    <option value="متفرغة"> متفرغة</option> 
                </select>
            </div>
            <div class="btn-container center">
                <input class="btn" type="submit" name="submit" value="حفظ">
            </div>    
        </form>
    `;
}