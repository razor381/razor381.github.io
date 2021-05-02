const menuBtn = document.querySelector('#menu-btn');
const hiddenMenuEl = document.querySelector('#hidden-menu-el');
const menuCloseBtn = document.querySelector('#menu-close-btn');

const getHiddenMenuDisplayStatus = () => hiddenMenuEl.style.display;

function closeHiddenMenu() {
  const screenWidth = document.documentElement.clientWidth;

  if ((screenWidth > 559) && getHiddenMenuDisplayStatus() !== 'none') {
    hiddenMenuEl.style.display = 'none';
  };
}

if (menuBtn && hiddenMenuEl) {
  menuBtn.addEventListener('click', () => {
    const display = getHiddenMenuDisplayStatus();
    hiddenMenuEl.style.display = display === 'block' ? 'none' : 'block';
  })
}

if (hiddenMenuEl && menuCloseBtn) {
  menuCloseBtn.addEventListener('click', () => {
    hiddenMenuEl.style.display = 'none';
  })
}

window.addEventListener("resize", closeHiddenMenu);

