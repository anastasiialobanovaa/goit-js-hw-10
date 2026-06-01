// 1. Импортируем библиотеку flatpickr и её стили
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// 2. Импортируем библиотеку iziToast и её стили
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Находим элементы интерфейса
const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');

const daysVal = document.querySelector('span[data-days]');
const hoursVal = document.querySelector('span[data-hours]');
const minutesVal = document.querySelector('span[data-minutes]');
const secondsVal = document.querySelector('span[data-seconds]');

let userSelectedDate = null;
let timerId = null;

// Настройки для календаря flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosenDate = selectedDates[0];

    // Проверка: если дата в прошлом или равна текущей
    if (chosenDate <= new Date()) {
      // Выводим красивое сообщение об ошибке через iziToast
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      startButton.disabled = true;
    } else {
      // Если дата валидна — сохраняем её и активируем кнопку
      userSelectedDate = chosenDate;
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

// Слушатель клика на кнопку запуска таймера
startButton.addEventListener('click', () => {
  // Задаем элементам неактивное состояние (ТЗ: кнопка и инпут блокируются)
  startButton.disabled = true;
  datetimePicker.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const deltaTime = userSelectedDate - currentTime;

    // Если таймер дошел до нуля или ушел в минус — останавливаем отсчет
    if (deltaTime <= 0) {
      clearInterval(timerId);
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      // ТЗ: после остановки таймера инпут снова активен, кнопка остается неактивной
      datetimePicker.disabled = false;
      return;
    }

    const timeComponents = convertMs(deltaTime);
    updateTimerInterface(timeComponents);
  }, 1000);
});

// Обновление цифр на экране
function updateTimerInterface({ days, hours, minutes, seconds }) {
  daysVal.textContent = addLeadingZero(days);
  hoursVal.textContent = addLeadingZero(hours);
  minutesVal.textContent = addLeadingZero(minutes);
  secondsVal.textContent = addLeadingZero(seconds);
}

// Форматирование: добавляет ведущий ноль, если число состоит из 1 символа
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функция конвертации миллисекунд (в точности из ТЗ GoIT)
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
