const Alert = (secusses, message, id = "") => {
    return (
        `
            <section class="alert center page">
                <article class="content center">
                    <header>
                        <i class="fa-solid ${secusses ? "fa-check-square" : "fa-xmark-square"}"></i>
                        <h3>${message}</h3>
                    </header>
                    ${
                        secusses ? `
                            <section>
                                <p>رقم الشحنة</p>
                                <b>${id}</b>
                            </section>
                        ` : ''
                    }
                    <section class="btn-container">
                        <button class="btn">متابعة</button>
                    </section>
                </article>
            </section>
        `
    );
}

export default Alert;