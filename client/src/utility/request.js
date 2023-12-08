function request(method, url, callbackSucsess, callbackFaild = null, body = null) {
    const status = {
        "GET": 200,
        "POST": 201,
        "PUT": 201,
        "DELETE": 204
    }

    const http = new XMLHttpRequest();

    http.onload = () => {
        if (http.status === status[method]) {
            const result = status[method] !== 204 ? JSON.parse(http.responseText) : {
                id: url.split('=')[1]
            };
            callbackSucsess(result);
        } else {
            if (callbackFaild)
                callbackFaild(result);
        }
    };

    http.open(method, url);

    http.send(body);
}

export default request;