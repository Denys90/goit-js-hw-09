function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

const refs = {
  start: document.querySelector('[data-start]'),
  stop: document.querySelector('[data-stop]'),
};

let timerId = null;
let themeChangeInProgress = false;

function onStartFn() {
  if (themeChangeInProgress) {
    return;
  }

  themeChangeInProgress = true;

  timerId = setInterval(() => {
    document.body.style.backgroundColor = getRandomHexColor();
  }, 1000);
}

function onStopFn() {
  clearInterval(timerId);
  themeChangeInProgress = false;
  enabledStartBtn;
}

function enabledStartBtn() {
  refs.start.enabled = false;
}

refs.start.addEventListener('click', onStartFn);
refs.stop.addEventListener('click', onStopFn);
