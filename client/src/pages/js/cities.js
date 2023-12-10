import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import Alert from '../../components/Alert.js';
import request from '../../utility/request.js';
import btnDeleteEvent from '../../utility/btnDeleteEvent.js';

const header = document.querySelector("body > header:first-child");
header.innerHTML = Navbar();

document.body.innerHTML += Footer();

const renderCities = (cities) => {
    const tableBody = document.querySelector("table tbody");

    cities.forEach(city => {
        appendCity(tableBody, city);
    })
}

function getCities() {
    request("GET", `http://localhost:2000/Box/server/APIs/cities/cities.php`, renderCities);
}

getCities();

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

const handelAddCity = (city) => {
    const tbody = document.querySelector('table tbody');

    appendCity(tbody, city);

    sectionFrom.style.display = 'none';

    document.body.innerHTML += Alert(true, "تم إضافة المدينة");
    const btnContaniue = document.querySelector('.alert .btn-container:last-of-type button');

    btnContaniue.addEventListener('click', () => {
        document.querySelector('.alert').remove();
    });
}

const handelUpdateCity = (city) => {
    const name = document.querySelector(`.city-${city.id} > td:first-child`);
    name.innerText = city.city;

    const latitude = document.querySelector(`.city-${city.id} td:nth-of-type(2)`);
    latitude.innerText = city.latitude;

    const longitude = document.querySelector(`.city-${city.id} td:nth-of-type(3)`);
    longitude.innerText = city.longitude;

    const location = document.querySelector(`.city-${city.id} td:nth-of-type(4)`);
    location.innerHTML = `
        <div>
            <!-- Google Map Copied Code -->
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3861.9914780310255!2d${city.longitude}!3d${city.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDMyJzMyLjkiTiA0OcKwMDcnMjcuMyJF!5e0!3m2!1sar!2s!4v1701161169329!5m2!1sar!2s"
                width="200" height="100" style="border:0;" allowfullscreen="" loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
    `;

    const formUpdate = document.querySelector(`.city-${city.id} + tr > td`);
    formUpdate.style.display = "none";

    document.body.appendChild(Alert(true, `تم تحديث معلومات ${city.city}`));
    
    const btnContaniue = document.querySelector('.alert .btn-container:last-of-type button');

    btnContaniue.addEventListener('click', () => {
        document.querySelector('.alert').remove();
    });
}

const handelDeleteCity = (city) => {
    document.body.appendChild(Alert(true, "تم حذف المدينة"));

    const btnClose = document.querySelector('.alert .btn-container:first-of-type .btn');

    btnClose.onclick = () => {
        btnClose.parentElement.parentElement.parentElement.remove();
    }

    const btnContinue = document.querySelectorAll('.alert .btn')[document.querySelectorAll('.alert .btn').length - 1];

    btnContinue.onclick = () => {
        document.querySelector(`.city-${city.id} + tr`).remove();
        document.querySelector(`.city-${city.id}`).remove();

        const alerts = document.querySelectorAll(`.alert`);

        alerts.forEach(e => {
            e.remove();
        })
    }
}

formAdd.addEventListener('submit', (e) => {
    e.preventDefault();

    request("POST", "http://localhost:2000/Box/server/APIs/cities/add.php", handelAddCity, null, new FormData(formAdd));
})

function appendCity(tbody, city) {
    const row = document.createElement('tr');
    row.className = `city-${city.id}`;

    const name = document.createElement('td');
    name.innerText = city.city;

    const latitude = document.createElement('td');
    latitude.innerText = city.latitude;

    const longitude = document.createElement('td');
    longitude.innerText = city.longitude;

    const location = document.createElement('td');
    location.innerHTML = `
        <div>
            <!-- Google Map Copied Code -->
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3861.9914780310255!2d${city.longitude}!3d${city.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDMyJzMyLjkiTiA0OcKwMDcnMjcuMyJF!5e0!3m2!1sar!2s!4v1701161169329!5m2!1sar!2s"
                width="200" height="100" style="border:0;" allowfullscreen="" loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
    `;

    const btnContainer = document.createElement('td');
    btnContainer.className = "btn-container center";

    const btnUpdate = document.createElement('button');
    btnUpdate.className = `btn center btnUpdate-${city.id}`;
    btnUpdate.innerHTML = '<i class="fa-solid fa-pen"></i>';

    const btnDelete = document.createElement('button');
    btnDelete.className = `btn center btnDelete-${city.id}`;
    btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';

    btnContainer.appendChild(btnUpdate);
    btnContainer.appendChild(btnDelete);

    row.appendChild(name);
    row.appendChild(latitude);
    row.appendChild(longitude);
    row.appendChild(location);
    row.appendChild(btnContainer);

    tbody.appendChild(row);

    const rowForm = document.createElement('tr');
    const columnForm = document.createElement('td');
    columnForm.colSpan = "5";

    columnForm.innerHTML = renderUpdateForm(city);
    columnForm.className = `update-td form update-${city.id}`;

    btnEvents(btnUpdate, btnDelete, columnForm, city);

    rowForm.appendChild(columnForm);

    tbody.appendChild(rowForm);
}

function btnEvents(btnUpdate, btnDelete, columnFormormUpdate, city) {
    btnUpdate.addEventListener('click', () => {
        const btnClose = document.querySelector(`.update-${city.id} > header .btn`);
        btnClose.onclick = () => {
            columnFormormUpdate.style.display = "none";
        }

        const formUpdate = document.querySelector(`.update-${city.id} form`);

        columnFormormUpdate.style.display = 'table-cell';

        formUpdate.addEventListener('submit', (e) => {
            e.preventDefault();

            request("POST", "http://localhost:2000/Box/server/APIs/cities/update.php", handelUpdateCity, null, new FormData(formUpdate));
        });
    });

    const deleteAPI = `http://localhost:2000/Box/server/APIs/cities/delete.php?id=${city.id}`;

    btnDeleteEvent(btnDelete, "هل انت متأكد من حذف المدينة", deleteAPI, handelDeleteCity);
}

function renderUpdateForm(city) {
    return `
        <header>
            <h2><i class="fa-solid fa-city"></i> تعديل بيانات ${city.city}</h2>
    
            <section class="btn-container">
                <button class="btn center"><i class="fa-solid fa-close"></i></button>
            </section>
        </header>
    
        <form>
            <input type="hidden" name="id" readonly value="${city.id}">
            <div>
                <label for="city"><i class="fa-solid fa-city"></i>إسم المدينة</label>
                <input type="text" name="city" value="${city.city}" >
            </div>
            <div>
                <label for="latitude"><i class="fa-solid fa-location"></i>خط العرض</label>
                <input type="text" name="latitude" value="${city.latitude}">
            </div>
            <div>
                <label for="longitude"><i class="fa-solid fa-location"></i>خط الطول</label>
                <input type="text" name="longitude" value="${city.longitude}">
            </div>
            <div class="btn-container center">
                <input class="btn" type="submit" name="submit" value="إضافة">
            </div>   
        </form>
    `;
}