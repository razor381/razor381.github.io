const SCROLL_RATE = 20;
const AUTOSCROLL = 'autoscroll';
const MINIMAL = 'minimal';
const NO_BUTTONS = 'no-buttons';

const SCROLL_HOLD_DEFAULT = 3; //seconds
const PAUSE_TIME = 3; //seconds

const carouselEls = document.querySelectorAll('.carousel');

if (carouselEls && carouselEls.length) {
  carouselEls.forEach((el) => {
    new Carousel(el);
  });
}


/*
*   Class Carousel
*      @params:
*         element -> DOMElement
*
*      @props:
*         el -> DOMElement
*         contentEl ->DOMElement
*         windowWidth -> number
*         imageEls: -> array
*         activeIndex -> number
*         prevIndex -> number
*         this.autoScrollPaused -> Boolean;
*         navButtons: { leftButtonEl, rightButtonEl } -> object
*         navLeadersEl -> DOMElement
*         navLeaderEls: -> array
*         isMinimal: -> Boolean
*         isNoButtons: -> Boolean
*/

function Carousel(element) {
  const self = this;
  this.el = element;
  this.contentEl = this.el.querySelector('.carousel-content');
  this.windowWidth = this.contentEl.getBoundingClientRect().width;
  this.imageEls = Array.from(this.contentEl.children);
  this.activeIndex = 0;
  this.prevIndex = 0;
  this.autoScrollPaused = false;
  this.isMinimal = checkIsMinimal(self);
  this.isNoButtons = checkIsNoButtons(self);

  ({
    navButtons: this.navButtons,
    navLeadersEl: this.navLeadersEl,
    navLeaderEls: this.navLeaderEls,
  } = addNavigationElements(self, this.el));

  this.isAutoScroll = this.el.classList.contains(AUTOSCROLL);

  // -------- props end here --------

  onScrollCompletion(self);

  if (this.isAutoScroll || this.isMinimal) {
    addAutoScroll(self);
  }

  if (this.isMinimal) {
    hideButtons(self);
    this.navLeadersEl.style.display = 'none';
  }

  if (!this.isMinimal && this.isNoButtons) {
    hideButtons(self);
  }
}

function hideButtons(self) {
  self.navButtons.leftButtonEl.style.display = 'none';
  self.navButtons.rightButtonEl.style.display = 'none';
}

function checkIsMinimal(self) {
  const minimalIndex = searchSubstringIndex(self.el.classList, MINIMAL);
  return minimalIndex !== -1;
}

function checkIsNoButtons(self) {
  const noButtonIndex = searchSubstringIndex(self.el.classList, NO_BUTTONS);
  return noButtonIndex !== -1;
}

function searchSubstringIndex(list, reg) {
  return Array.from(list).findIndex(i => i.match(reg));
}

function getHoldTime(self) {
  const { classList } = self.el;
  const holdClassIndex = searchSubstringIndex(classList, /^hold\-/);

  if (holdClassIndex === -1) {
    return 0;
  }

  return Math.floor(+classList[holdClassIndex].split('-')[1]);
}

function checkIsLeftScroll (self) {
  const { classList } = self.el;
  const leftAutoScrollIndex = searchSubstringIndex(classList, 'left-autoscroll');

  return !!(leftAutoScrollIndex !== -1) ;
}

function getNewIteratorVal(self, iterator, isLeftScroll) {
  const imagesNumber = self.imageEls.length;

  if (isLeftScroll) {
    --iterator;
    return iterator < 0 ? imagesNumber - 1 : iterator;
  }

  return ++iterator % imagesNumber;
}

function addAutoScroll(self) {
  let iterator = 0;

  const holdTime = getHoldTime(self) || SCROLL_HOLD_DEFAULT;
  const isLeftScroll = checkIsLeftScroll(self);

  setInterval(() => {
    if (!self.autoScrollPaused) {
      iterator = getNewIteratorVal(self, iterator, isLeftScroll);
      self.activeIndex = iterator;

      animateScroll(self);
      onScrollCompletion(self);
    }
  }, holdTime * 1000)
}

function updateNavButtonVisibility(self) {
  const leftBtn = self.navButtons.leftButtonEl;
  const rightBtn = self.navButtons.rightButtonEl;

  if (leftBtn.classList.contains('hidden')) {
    leftBtn.classList.remove('hidden');
  }

  if (rightBtn.classList.contains('hidden')) {
    rightBtn.classList.remove('hidden');
  }

  if (self.activeIndex === 0) {
    self.navButtons.leftButtonEl.classList.add('hidden');
    return;
  }

  if (self.activeIndex === self.imageEls.length - 1 ) {
    self.navButtons.rightButtonEl.classList.add('hidden');
    return;
  }
}

function updateLeaderPosition(self) {
  self.navLeaderEls.forEach((leaderEl, index) => {
    if (index === self.activeIndex) {
      leaderEl.classList.add('nav-leader--active');
      return;
    }
    leaderEl.classList.remove('nav-leader--active');
  });
}

function onScrollCompletion(self) {

  /*
  * @TODO: add scroll-past-boundary behavior options
  *
  * - add modifier to choose between default, no-boundary-scroll or circular-scroll
  * - left due to insufficient time
  * - uncomment below code after adding feature
  *
  */

  // updateNavButtonVisibility(self);
  updateLeaderPosition(self);
}

function getNewActiveIndex(self, isRightScroll) {
  const maxIndex = self.imageEls.length - 1;

  if (self.activeIndex === 0 && !isRightScroll) {
    return maxIndex;
  }

  if (self.activeIndex === maxIndex && isRightScroll) {
    return 0;
  }

  return isRightScroll ? self.activeIndex + 1 : self.activeIndex - 1;
}

function addButtonMovementListener(self, buttonEl, isRightScroll=true) {
  buttonEl.addEventListener('click', () => {
    self.activeIndex = getNewActiveIndex(self, isRightScroll);

    delayAutoScroll(self);

    animateScroll(self);
    onScrollCompletion(self);
  });
}

function addLeaderMovementListener(self, leaderEls) {
  leaderEls.forEach((leaderEl, index) => {
    leaderEl.addEventListener('click', (e) => {
      if (self.activeIndex === index) return;

      delayAutoScroll(self);

      self.activeIndex = Array.from(leaderEl.parentNode.children).indexOf(leaderEl);
      animateScroll(self);

      onScrollCompletion(self);
  })
  })
}

function addNavigationElements(self, el) {
  const navButtons = addNavigationButtons(self, el);
  const { navLeadersEl, navLeaderEls } = addNavigationLeaders(self, el);

  return { navButtons, navLeadersEl, navLeaderEls };
}

function addNavigationButtons(self, el) {
  const leftButtonEl = document.createElement('button');
  const rightButtonEl = document.createElement('button');

  leftButtonEl.classList.add('carousel__left-btn')
  leftButtonEl.innerHTML = '<';

  rightButtonEl.classList.add('carousel__right-btn')
  rightButtonEl.innerHTML = '>';

  el.appendChild(leftButtonEl);
  el.appendChild(rightButtonEl);

  addButtonMovementListener(self, rightButtonEl);
  addButtonMovementListener(self, leftButtonEl, false);

  return { leftButtonEl, rightButtonEl };
}

function addNavigationLeaders(self, el) {
  const navLeadersEl = document.createElement('div');
  const imagesNumber = self.contentEl.children.length;
  const navLeaderEls = [];

  navLeadersEl.classList.add('nav-leaders');

  for (let i = 0; i < imagesNumber; i++) {
    const navLeaderEl = document.createElement('button');
    navLeaderEl.classList.add(
      'nav-leader',
      i === 0 ? 'nav-leader--active' : null,
    );
    navLeadersEl.appendChild(navLeaderEl);
    navLeaderEls.push(navLeaderEl);
  }

  addLeaderMovementListener(self, navLeaderEls);

  el.appendChild(navLeadersEl);

  return {navLeadersEl, navLeaderEls};
}

function delayAutoScroll(self) {
  self.autoScrollPaused = true;
  setTimeout(() => self.autoScrollPaused = false, PAUSE_TIME * 1000);
}

function animateScroll(self) {
  if (self.activeIndex === self.prevIndex) return;

  const firstImg = self.imageEls[0];
  let finalVal = -1 * self.activeIndex * self.windowWidth;
  let initialVal = -1 * self.prevIndex * self.windowWidth;

  let direction = (self.activeIndex > self.prevIndex) ? -1 : 1;
  let increment = Math.abs(self.activeIndex - self.prevIndex) * (self.windowWidth/SCROLL_RATE) * direction;

  animate(initialVal);

  function animate(val) {
    firstImg.style.marginLeft = val + 'px';
    if (Math.floor(Math.abs(finalVal - val)) === 0 ) return;
    window.requestAnimationFrame(() => animate(val + increment));
  }

  self.prevIndex = self.activeIndex;
  firstImg.style.marginLeft = finalVal + 'px';
}
