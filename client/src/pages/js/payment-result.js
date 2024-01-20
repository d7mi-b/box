import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import request from '../../utility/request.js';

const header = document.querySelector("body > header:first-child");
header.innerHTML = Navbar();

document.body.innerHTML += Footer();

let result = location.href.split("?")[1].split("=")[1];

console.log(result);
result = JSON.parse(result.replaceAll("%22", '"'));

const main = document.getElementsByTagName("main")[0];

if (result.statusCode === 900) {
    main.innerHTML = `
        <article class='page center' style='justify-content: center; text-align: center'>
            <header class='center' style='margin: 2rem'>
                <section style="font-size: 5rem; line-height: 1;">
                    <i class="fa-solid fa-square-check"></i>
                </section>
                <h1>تم الدفع بنجاح</h1>
            </header>
            <section>
                <a class='btn' style="width: 10rem; display:block; margin: 0 auto" href="http://localhost:8000/Box/client">المتابعة</a>
        </article>
    `;
} else {
    main.innerHTML = `
        <article class='page center' style='justify-content: center; text-align: center'>
            <header class='center' style='margin: 2rem'>
                <section style="font-size: 5rem; line-height: 1;">
                    <i class="fa-solid fa-rectangle-xmark"></i>
                </section>
                <h1>حدث خطأ ما</h1>
            </header>
            <section>
                <a class='btn' style="width: 10rem; display:block; margin: 0 auto" href="http://localhost:8000/Box/client/src/pages/payment-page.html?id=${result.orderID}">
                    العودة
                </a>
        </article>
    `;
}