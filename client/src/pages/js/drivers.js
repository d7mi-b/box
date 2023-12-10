import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import Alert from '../../components/Alert.js';
import request from '../../utility/request.js';
import btnDeleteEvent from '../../utility/btnDeleteEvent.js';

const header = document.querySelector("body > header:first-child");
header.innerHTML = Navbar();

document.body.innerHTML += Footer();


// ###### START HAMDEL REQUEST FUNCTIONS ----------------------------------------------------------------------
const handelGetDriver = (drivers) => {
    const tableBody = document.querySelector("table tbody");
            
    drivers.forEach(driver => {
        renderDriver(tableBody, driver);
    })
}

const handelAddDriver = (driver) => {
    const tbody = document.querySelector('table tbody');

    renderDriver(tbody, driver);

    sectionFrom.style.display = 'none';
}

const handelUpdateDriver = (driver) => {
    const name = document.querySelector(`.driver-${driver.id} > td:first-child`);
    name.innerText = driver.name;

    const email = document.querySelector(`.driver-${driver.id} td:nth-of-type(2)`);
    email.innerText = driver.email;

    const phone = document.querySelector(`.driver-${driver.id} td:nth-of-type(3)`);
    phone.innerText = driver.phone;

    const formUpdate = document.querySelector(`.driver-${driver.id} + tr > td`);
    formUpdate.style.display = "none";

    document.body.appendChild(Alert(true, `تم تحديث معلومات ${driver.name}`));
    
    const btnContaniue = document.querySelector('.alert .btn-container:last-of-type button');

    btnContaniue.addEventListener('click', () => {
        document.querySelector('.alert').remove();
    });
}

const handelDeleteDriver = (driver) => {
    document.body.appendChild(Alert(true, "تم حذف السائق"));

    const btnClose = document.querySelector('.alert .btn-container:first-of-type .btn');

    btnClose.onclick = () => {
        document.querySelector('.alert').remove();
    }

    const btnContinue = document.querySelectorAll('.alert .btn')[document.querySelectorAll('.alert .btn').length - 1];

    btnContinue.onclick = () => {
        document.querySelector(`.driver-${driver.id} + tr`).remove();
        document.querySelector(`.driver-${driver.id}`).remove();

        const alerts = document.querySelectorAll(`.alert`);

        alerts.forEach(e => {
            e.remove();
        })
    }
}
// ###### END HAMDEL REQUEST FUNCTIONS ----------------------------------------------------------------------

// ##### START GET DRIVERS -----------------------------------------------------------------------------------
function getDrivers() {
    request("GET", `http://localhost:2000/Box/server/APIs/drivers/drivers.php`, handelGetDriver);
}

getDrivers();
// ##### END GET DRIVERS -----------------------------------------------------------------------------------

// ##### START ADD DRIVERS -----------------------------------------------------------------------------------
const sectionFrom = document.querySelector('.form');
const formAdd = document.forms[0];
const btnAdd = document.querySelector('.shipment > header .btn');
const btnClose = document.querySelector('.form > header .btn');

btnAdd.addEventListener('click', () => {
    sectionFrom.style.display = 'block';
});

btnClose.addEventListener('click', () => {
    sectionFrom.style.display = 'none';
});

formAdd.addEventListener('submit', (e) => {
    e.preventDefault();

    request("POST", "http://localhost:2000/Box/server/APIs/drivers/add.php", handelAddDriver, null, new FormData(formAdd));
})
// ##### END ADD DRIVERS -----------------------------------------------------------------------------------

// #### START RENDER FUNCTIONS, UPDATE AND DRIVER FUNCTIONS -------------------------------------------------------
function renderDriver (tbody, driver) {
    const row = document.createElement('tr');
    row.className = `driver-${driver.id}`;

    const name = document.createElement('td');
    name.innerText = driver.name;

    const email = document.createElement('td');
    email.innerText = driver.email;

    const phone = document.createElement('td');
    phone.innerText = driver.phone;

    const btnContainer = document.createElement('td');
    btnContainer.className = "btn-container center";

    const btnUpdate = document.createElement('button');
    btnUpdate.className = `btn center btnUpdate-${driver.id}`;
    btnUpdate.innerHTML = '<i class="fa-solid fa-pen"></i>';

    const btnDelete = document.createElement('button');
    btnDelete.className = `btn center btnDelete-${driver.id}`;
    btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';

    btnContainer.appendChild(btnUpdate);
    btnContainer.appendChild(btnDelete);

    row.appendChild(name);
    row.appendChild(email);
    row.appendChild(phone);
    row.appendChild(btnContainer);

    tbody.appendChild(row);

    const rowForm = document.createElement('tr');
    const columnForm = document.createElement('td');
    columnForm.colSpan = "4";

    columnForm.innerHTML = renderUpdateForm(driver);
    columnForm.className = `update-td form update-${driver.id}`;

    btnEvents(btnUpdate, btnDelete, columnForm, driver);

    rowForm.appendChild(columnForm);

    tbody.appendChild(rowForm);
}

function btnEvents (btnUpdate, btnDelete, columnFormormUpdate, driver) {
    btnUpdate.addEventListener('click', () => {
        const btnClose = document.querySelector(`.update-${driver.id} > header .btn`);

        btnClose.onclick = () => {
            columnFormormUpdate.style.display = "none";
        }

        const formUpdate = document.querySelector(`.update-${driver.id} form`);

        columnFormormUpdate.style.display = 'table-cell';

        formUpdate.addEventListener('submit', (e) => {
            e.preventDefault();

            request("POST", "http://localhost:2000/Box/server/APIs/drivers/update.php", handelUpdateDriver, null, new FormData(formUpdate));
        });
    });

    const deleteAPI = `http://localhost:2000/Box/server/APIs/drivers/delete.php?id=${driver.id}`;

    btnDeleteEvent(btnDelete, "هل انت متأكد من حذف السائق", deleteAPI, handelDeleteDriver);
}

function renderUpdateForm (driver) {
    return `
        <header>
            <h2><i class="fa-solid fa-user-plus"></i> تعديل بيانات ${driver.name}</h2>
    
            <section class="btn-container">
                <button class="btn center"><i class="fa-solid fa-close"></i></button>
            </section>
        </header>
    
        <form>
            <input type="hidden" name="id" readonly value="${driver.id}">
            <div>
                <label for="name"><i class="fa-solid fa-user"></i> الاسم</label>
                <input type="text" name="name" value="${driver.name}">
            </div>
            <div>
                <label for="email"><i class="fa-solid fa-envelope"></i> البريد الإلكتروني</label>
                <input type="email" name="email" value="${driver.email}">
            </div>
            <div>
                <label for="phone"><i class="fa-solid fa-phone"></i> الهاتف</label>
                <input type="tel" name="phone" value="${driver.phone}">
            </div>
            <div class="btn-container center">
                <input class="btn" type="submit" name="submit" value="حفظ">
            </div>    
        </form>
    `;
}
// #### END RENDER FUNCTIONS, UPDATE AND DRIVER FUNCTIONS -------------------------------------------------------