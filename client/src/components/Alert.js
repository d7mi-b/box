const Alert = (secusses, message, id = null) => {
    const alert = document.createElement('section');
    alert.className = "alert center page";

    const content = document.createElement("article");
    content.className = "content center";

    const btnContainer = document.createElement('section');
    btnContainer.className = "btn-container";

    const btnClose = document.createElement("button");
    btnClose.className = "btn center";
    btnClose.innerHTML = '<i class="fa-solid fa-close"></i>';

    btnContainer.appendChild(btnClose);

    content.appendChild(btnContainer);

    content.innerHTML += `
        <header>
            <i class="fa-solid ${secusses ? "fa-check-square" : "fa-xmark-square"}"></i>
            <h3>${message}</h3>
        </header>
        ${
            secusses && id ? `
                <section>
                    <p>رقم الشحنة</p>
                    <b>${id}</b>
                </section>
            ` : ''
        }
        <section class="btn-container">
            <button class="btn">متابعة</button>
        </section>
    `;

    alert.appendChild(content);

    return alert;
}

export default Alert;