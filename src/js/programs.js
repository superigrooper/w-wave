const progs = document.querySelectorAll('.programs__block');
progs[0].classList.add('programs__block--active');

const choices = new Choices(document.querySelector('.programs__select'), {
  searchEnabled: false,
  shouldSort: false,
  itemSelectText: '',
})
/**
 *
 * Сравнивает data-атрибут у выбранного селекта и
 * если он совпадает с data-атрибутом блока с программами,
 * то данный блок отображается
 *
 * */
export const programs = () => {
  const select = document.querySelector('.choices');
  const contentItems = document.querySelectorAll('.programs__block');

  select.addEventListener('change', () => {
    const option = select.querySelector('[aria-selected]');
    contentItems.forEach((item) => {
      if (item.dataset.target === option.dataset.value) {
        item.classList.add('programs__block--active')
      } else {
        item.classList.remove('programs__block--active')
      }
    })
  })
}
