export function programs() {
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
