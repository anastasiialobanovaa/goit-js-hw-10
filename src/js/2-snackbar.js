// 1. Импортируем библиотеку iziToast и её стили для Vite
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// 2. Находим форму на странице
const form = document.querySelector('.form');

// 3. Вешаем слушатель события submit (отправка формы)
form.addEventListener('submit', event => {
  // Отменяем стандартное поведение браузера (перезагрузку страницы)
  event.preventDefault();

  // Получаем значения из инпутов формы
  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  // 4. Создаем промис
  createPromise(delay, state)
    .then(delay => {
      // Этот блок выполнится, если статус был fulfilled (успех)
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      // Этот блок выполнится, если статус был rejected (ошибка)
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });

  // Дополнительно: очищаем форму после отправки (по желанию/ТЗ)
  form.reset();
});

// 5. Функция генерации промиса
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    // Устанавливаем задержку выполнения
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay); // Успешное выполнение
      } else {
        reject(delay); // Выполнение с ошибкой
      }
    }, delay);
  });
}
