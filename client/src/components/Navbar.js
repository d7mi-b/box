const Navbar = () => {
    return (
        `
            <nav class="navbar">
                <section class="logo">
                    <i class="fa-solid fa-box"></i>
                    <span class="">بوكس</span>
                </section>

                <ul class="nav-list">
                    <li class="logo">
                        <i class="fa-solid fa-box"></i>
                        <span class="">بوكس</span>
                    </li>
                    <li class="bar center">
                        <i class="fa-solid fa-bars"></i>
                    </li>
                    <ul>
                        <li class="logo">
                            <i class="fa-solid fa-box"></i>
                            <span class="">بوكس</span>
                        </li>
                        <li><a href="/Box/client/index.html">الرئيسية</a></li>
                        <li><a href="/Box/client/index.html#about">بوكس؟</a></li>
                        <li><a href="/Box/client/src/pages/request-shipment.html">طلب شحن بضاعة</a></li>
                        <li><a href="/Box/client/src/pages/shipment-query.html">الإستعلام عن شحنة</a></li>
                    </ul>
                </ul>

                <section class="btn-container center">
                    <a href="/Box/client/src/pages/request-shipment.html" class="btn">اطلب شحن</a>
                </section>
            </nav>
        `
    );
}

export default Navbar;