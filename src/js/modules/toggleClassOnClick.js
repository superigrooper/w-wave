/**
 * Первый аргумент - массив.
 * Второй аргумент - строка с названием класса.
 * Назначает переданный класс по клику на текущий элемент массива
 * и удаляет класс у остальных элементов.
 * */
const toggleClassOnClick = (items, className) => {
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      let currentBtn = e.currentTarget;
      items.forEach((item) => { if (item !== currentBtn) item.classList.remove(className) });
      item.classList.toggle(className);
    })
  })
}
