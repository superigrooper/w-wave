import {programs} from "./programs.js";

window.addEventListener('DOMContentLoaded', (e) => {
  const progs = document.querySelectorAll('.programs__block');
  progs[0].classList.add('programs__block--active');

  const choices = new Choices(document.querySelector('.programs__select'), {
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
  })

  programs();
});
