const podcastBtns = document.querySelectorAll('.card-podcast__play');
toggleClassOnClick(podcastBtns, 'card-podcast__play--active');
programs();
new Accordion('.accordion__list');

document.querySelectorAll('.playlists__input')[0].setAttribute('checked', 'true');
document.querySelector('.playlists__pegi-year').textContent = new Date().getFullYear();
