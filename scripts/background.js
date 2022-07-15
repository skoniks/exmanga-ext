console.log('ExManga loaded');
const DEBUG = false;

const listener = ({ request, location }, sender, callback) => {
  let [url, ...params] = request;
  if (url[0] === '/') url = location.origin + url;
  fetch(url, ...params)
    .then((response) => {
      const { status, statusText, headers } = response;
      const init = { status, statusText, headers };
      const type = headers.get('content-type').split(';').shift();
      if (type === 'application/json') {
        response.json().then((body) => {
          const regex = /api\/titles\/chapters\/(\d*)\//;
          const match = url.match(regex);
          if (match && body.content.is_paid) {
            if (body.content.is_bought) {
              // Upload
              fetch('https://exmanga.ru/chapter', {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
              })
                .then((response) => response.json())
                .then(({ success, data }) => {
                  console.log(`Chapter ${match[1]} - ${data}`);
                });
              body = JSON.stringify(body);
              const message = '[ExManga] Глава отправлена на сервер';
              callback({ body, type, init, message });
              !DEBUG || console.log(url, body, init);
            } else {
              // Dowload
              fetch('https://exmanga.ru/chapter?id=' + match[1])
                .then((response) => response.json())
                .then(({ success, data }) => {
                  if (success) {
                    console.log(
                      `Chapter ${match[1]} - Глава получена с сервера`,
                    );
                    delete body.content.volume;
                    body.content.is_bought = true;
                    body.content.pages = data;
                    body.msg = '';
                    init.status = 200;
                    body = JSON.stringify(body);
                    const message = '[ExManga] Глава получена с сервера';
                    callback({ body, type, init, message });
                    !DEBUG || console.log(url, body, init);
                  } else {
                    console.log(`Chapter ${match[1]} - ${data}`);
                    body = JSON.stringify(body);
                    const message = `[ExManga] ${data}`;
                    callback({ body, type, init, message });
                    !DEBUG || console.log(url, body, init);
                  }
                });
            }
          } else {
            callback({ body: JSON.stringify(body), type, init });
            !DEBUG || console.log(url, body, init);
          }
        });
      } else {
        response.text().then((body) => {
          callback({ body, type, init });
        });
      }
    })
    .catch((error) => {
      console.error(url, error);
    });
  return true;
};

chrome.runtime.onMessage.addListener(listener);
chrome.runtime.onMessageExternal.addListener(listener);
