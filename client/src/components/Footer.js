const Footer = () => {
    return (
        `
            <footer class="footer">
                <section class="logo">
                    <i class="fa-solid fa-box"></i>
                    <span>بوكس</span>
                    <p>النقل صار أسهل</p>
                </section>

                <ul>
                    <li><a href="/Box/client/index.html">الرئيسية</a></li>
                    <li><a href="/Box/client/index.html#about">بوكس؟</a></li>
                    <li><a href="/Box/client/src/pages/request-shipment.html">طلب شحن بضاعة</a></li>
                    <li><a href="/Box/client/src/pages/shipment-query.html">الإستعلام عن شحنة</a></li>
                </ul>

                <ul class="icons">
                    <li class="center"><a href="#"><i class="fa-brands fa-square-x-twitter"></i></a></li>
                    <li class="center"><a href="#"><i class="fa-brands fa-whatsapp-square"></i></a></li>
                    <li class="center"><a href="#"><i class="fa-brands fa-instagram-square"></i></a></li>
                    <li class="center"><a href="#"><i class="fa-brands fa-linkedin"></i></a></li>
                    <li class="center"><a href="#"><i class="fa-solid fa-envelope"></i></a></li>
                </ul>

                <p class="copyright">الحقوق محفوظة &copy; بوكس 2023</p>
            </footer>
        `
    );
}

export default Footer;