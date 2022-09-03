/**
 * Первый аргумент - массив.
 * Второй аргумент - строка с названием класса.
 * Назнчает переданный класс по клику текущий элемент массива
 * и удаляет класс у остальных элементов.
 * */
export const toggleClassOnClick = (items, className) => {
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      let currentBtn = e.currentTarget;
      items.forEach((item) => { if (item !== currentBtn) item.classList.remove(className) });
      item.classList.toggle(className);
    })
  })
}
