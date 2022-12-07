const podcastsBtn = document.querySelector('.podcasts__btn')
const podcastsItems = document.querySelectorAll('.podcasts__item')

podcastsBtn.addEventListener('click', () => {
  podcastsItems.forEach((elem) => {
    elem.style.display = 'list-item'
  })
  podcastsBtn.disabled = true
})
