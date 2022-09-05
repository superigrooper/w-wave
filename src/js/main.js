import {programs} from "./programs.js";
import {toggleClassOnClick} from "./toggleClassOnClick.js";

/*========== Подкасты ==========*/
const podcastBtns = document.querySelectorAll('.card-podcast__play');
toggleClassOnClick(podcastBtns, 'card-podcast__play--active');
programs();
new Accordion('.accordion__list');
