const menuBtn = document.querySelector('#menu-btn');
const hiddenMenuEl = document.querySelector('#hidden-menu-el');
const menuCloseBtn = document.querySelector('#menu-close-btn');
const body = document.querySelector('body');

const POSITION_FIXED = 'fixed';
const POSITION_INITIAL = 'initial';
const DISPLAY_NONE = 'none';
const DISPLAY_BLOCK = 'block';
const MOBILE_SCREEN_WIDTH = 559;

const getHiddenMenuDisplayStatus = () => hiddenMenuEl.style.display;

function closeHiddenMenu() {
  const screenWidth = document.documentElement.clientWidth;

  if ((screenWidth > MOBILE_SCREEN_WIDTH) && getHiddenMenuDisplayStatus() !== DISPLAY_NONE) {
    hiddenMenuEl.style.display = DISPLAY_NONE;
    body.style.position = POSITION_INITIAL;
  };
}

if (menuBtn && hiddenMenuEl) {
  menuBtn.addEventListener('click', () => {
    hiddenMenuEl.style.display = DISPLAY_BLOCK;
    body.style.position = POSITION_FIXED;
  })
}

if (hiddenMenuEl && menuCloseBtn) {
  menuCloseBtn.addEventListener('click', () => {
    hiddenMenuEl.style.display = DISPLAY_NONE;
    body.style.position = POSITION_INITIAL;
  })
}

window.addEventListener('resize', closeHiddenMenu);


