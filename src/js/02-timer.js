import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  dateTimePicker: document.querySelector("input[type='text']"),
  startBtn: document.querySelector('button[type="button"]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

refs.startBtn.disabled = true;
let selectDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose([selectedDates]) {
    if (selectedDates <= Date.now()) {
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      refs.startBtn.disabled = false;
      selectDate = selectedDates;
    }
  },
};

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
  }

  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;

    this.intervalId = setInterval(() => {
      const specifiedTime = selectDate - Date.now();
      const time = this.convertMs(specifiedTime);

      this.onTick(time);

      if (specifiedTime <= 999) {
        Notiflix.Notify.failure('The countdown is over!');
        clearInterval(this.intervalId);
        this.isActive = false;
        const timeCounter = this.convertMs(specifiedTime);
        this.onTick(timeCounter);
      }
    }, 1000);
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
}

flatpickr(refs.dateTimePicker, options);

const timer = new Timer({
  onTick: updateCounter,
});
function updateCounter({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${addZero(days)}`;
  refs.hours.textContent = `${addZero(hours)}`;
  refs.minutes.textContent = `${addZero(minutes)}`;
  refs.seconds.textContent = `${addZero(seconds)}`;
  refs.startBtn.setAttribute('disabled', true);
}

function addZero(value) {
  return String(value).padStart(2, '0');
}

refs.startBtn.addEventListener('click', timer.start.bind(timer));
