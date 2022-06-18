console.log('ExManga loaded');

var preload = `
window.fetch = (...request) =>
  new Promise((resolve) => {
    chrome.runtime.sendMessage(
      '${chrome.runtime.id}',
      { request, location },
      ({ body, type, init, message }) => {
        if (message) {
          const element = document.createElement('span');
          element.innerText = message;
          let container = document.querySelector('.notify-container');
          if (!container) {
            container = document.createElement('div');
            container.className = 'notify-container';
            document.body.appendChild(container);
          }
          container.appendChild(element);
          setTimeout(() => {
            element.className = 'show';
          }, 100);
          setTimeout(() => {
            element.className = '';
          }, 7300);
          setTimeout(() => element.remove(), 7500);
        }
        const blob = new Blob([body], { type });
        resolve(new Response(blob, init));
      },
    );
  });
`;

document.documentElement.setAttribute('onreset', preload);
document.documentElement.dispatchEvent(new CustomEvent('reset'));
document.documentElement.removeAttribute('onreset');

window.onload = () => {
  // Check updates
  const url =
    'https://raw.githubusercontent.com/skoniks/exmanga-ext/master/manifest.json';
  const local = chrome.runtime.getManifest();
  chrome.runtime.sendMessage(
    chrome.runtime.id,
    { request: [url] },
    ({ body }) => {
      const remote = JSON.parse(body);
      if (parseFloat(remote.version) > parseFloat(local.version)) {
        if (confirm('Доступно обновление ExManga! Перейти на страницу?')) {
          window.open('https://github.com/skoniks/exmanga-ext');
        }
      }
    },
  );
};
