import request from "./request.js";
import Alert from "../components/Alert.js"

const btnDeleteEvent = (btnDelete, alertMessage, API, callbackRequest) => {
    btnDelete.addEventListener('click', () => {
        document.body.appendChild(Alert(false, alertMessage));

        const btnClose = document.querySelector('.alert .btn-container:first-of-type .btn');

        btnClose.onclick = () => {
            document.querySelector('.alert').remove();
        }

        const btnContinue = document.querySelector('.alert .btn-container:last-of-type .btn');

        btnContinue.onclick = () => {
            request("DELETE", API, callbackRequest);
        }
    })
}

export default btnDeleteEvent;