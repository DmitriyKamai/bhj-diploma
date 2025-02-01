/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    if (options.callback) {
        xhr.onload = function() {
            if(xhr.readyState == 4 && xhr.status == 200){
                options.callback(xhr.response?.error, xhr.response);
            } else if (xhr.onerror) {
                options.callback(xhr.response.error);
            }
          };
    };
    if (options.method === 'GET') {
        if (options.data) {
            let params;
            if ((typeof options.data) === 'string') {
                params = options.data
            } else {
                params = `?${new URLSearchParams(options.data).toString()}`;
            }
            xhr.open(options.method, `${options.url}/${params}`, true);
        } else {
            xhr.open(options.method, options.url, true);
        }
        xhr.responseType = 'json';
        xhr.send();
    } else {
        xhr.open(options.method, options.url, true);
        xhr.responseType = 'json';
        if (options.data) {
            xhr.send(options.data);
        } else {
            xhr.send();
        }
    }
    return xhr;
};

