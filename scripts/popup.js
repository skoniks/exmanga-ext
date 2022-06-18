const load = document.getElementById('update');
const next = document.getElementById('next');
const list = document.querySelector('.list');
var total = 0;

const template = (item) => `
<li class="item">
  <span class="title">${item.name}</span>
  <div class="chapter">
    <span>${item.tome} - ${item.chapter}</span>
    <a href="https://remanga.org/manga/${item.dir}/ch${item.id}" target="_blank" title="Открыть главу">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path
          d="M256 64C256 46.33 270.3 32 288 32H415.1C415.1 32 415.1 32 415.1 32C420.3 32 424.5 32.86 428.2 34.43C431.1 35.98 435.5 38.27 438.6 41.3C438.6 41.35 438.6 41.4 438.7 41.44C444.9 47.66 447.1 55.78 448 63.9C448 63.94 448 63.97 448 64V192C448 209.7 433.7 224 416 224C398.3 224 384 209.7 384 192V141.3L214.6 310.6C202.1 323.1 181.9 323.1 169.4 310.6C156.9 298.1 156.9 277.9 169.4 265.4L338.7 96H288C270.3 96 256 81.67 256 64V64zM0 128C0 92.65 28.65 64 64 64H160C177.7 64 192 78.33 192 96C192 113.7 177.7 128 160 128H64V416H352V320C352 302.3 366.3 288 384 288C401.7 288 416 302.3 416 320V416C416 451.3 387.3 480 352 480H64C28.65 480 0 451.3 0 416V128z"
        />
      </svg>
    </a>
  </div>
</li>
`;

const update = () => {
  total = 0;
  list.innerHTML = '';
  load.className = 'spin';
  fetch(`https://exmanga.ru/chapter/updates?skip=${total}`)
    .then((response) => response.json())
    .then(({ success, data }) => {
      load.className = '';
      if (!success) return;
      for (const item of data) {
        list.innerHTML += template(item);
        total++;
      }
    });
};
const skip = () => {
  load.className = 'spin';
  fetch(`https://exmanga.ru/chapter/updates?skip=${total}`)
    .then((response) => response.json())
    .then(({ success, data }) => {
      load.className = '';
      if (!success || !data.length) return;
      list.innerHTML = '';
      for (const item of data) {
        list.innerHTML += template(item);
        total++;
      }
    });
};

window.onload = update;
load.onclick = update;
next.onclick = skip;
