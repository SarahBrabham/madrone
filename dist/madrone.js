const fontSize = 16;
const smallestEm = 12;
const largestEm = 27;
// Wait for the page to finish before looking for the superfish toggles.
window.addEventListener('load', () => {
  let breadCrumbSize = document.querySelectorAll('.block-system-breadcrumb-block nav ol li');
  if (breadCrumbSize.length < 3) {
    let breadCrumbOl = document.querySelectorAll('.block-system-breadcrumb-block nav ol.breadcrumb');
    breadCrumbOl[0].classList.add('flex-row');
  }

  const superfishMenus = [...document.querySelectorAll('ul.sf-menu')];
  superfishMenus.map(menu => {
    let menuId = menu.getAttribute('id');
    let menuToggles = document.querySelectorAll(`a#${menuId}-toggle`);
    [...menuToggles].map(menuToggle => {
      menuToggle.addEventListener('click', event => {
        menuClickedText(menuToggle);
      })
    })
  });

  // Check on page load if we need to be a mobile menu.
  if (window.innerWidth <= 768) {
    groupMobileMenu();
    document.querySelector('#group-content-menu').classList.add('d-none');
  }

  // handle group menu horizontal spacing
  const groupMenus = [...document.querySelectorAll('.block-group-content-menu ul#group-content-menu.menu--level-1 li ul')];
  groupMenus.forEach(menu => {
    resizeMenu(menu);
    if (!menu.classList.contains('menu--level-2')) {
      // move the child element 100% of its width.
      menu.style.left = '100%';
    }
  });

  // this must come after groupMobileMenu() since .menu--level-1 changes there
  const liList = [...document.querySelectorAll('.block-group-content-menu .menu--level-1 li')];
  liList.forEach(li => {
    // if li has child ul element
    if ([...(li.children)].some(e => e.tagName === 'UL')) {
      // add class chevron icon
      li.classList.add('group-sub-menu');
    }
  });

  // Add event listeners only for desktop.
  const desktopMenuLiList = [...document.querySelectorAll('.block-group-content-menu ul#group-content-menu.menu--level-1 li')];
  desktopMenuLiList.forEach(desktopLi => {
    desktopLi.addEventListener('mouseenter', menuItemHoverEvent);
    desktopLi.addEventListener('focusin', menuItemFocusinEvent);
    desktopLi.addEventListener('mouseleave', menuItemMouseLeaveEvent);
    desktopLi.addEventListener('focusout', menuItemMouseLeaveEvent);
  });

  // Add an overflow hidden class to the parent element if the block is inside a column class and has animations.
  const animatedBlocks = [...document.querySelectorAll(".block.aos-init")];
  animatedBlocks.map(block => {
    let blockParent = block.parentElement;
    for (let i = 0; i < blockParent.classList.length; i++) {
      if (/col-.*/.test(blockParent.classList[i])) {
        blockParent.classList.add('overflow-hidden');
        break;
      }
    }
  });
});

/**
 * Update text next to menu name to Close when Opened.
 * @param sfToggle
 */
function menuClickedText(sfToggle) {
  if (sfToggle.classList.contains('sf-expanded')) {
    let menuToggleText = sfToggle.textContent;
    sfToggle.textContent = `Close ${menuToggleText}`;
  } else {
    sfToggle.textContent = sfToggle.textContent.replace('Close ', '');
  }
}

/**
 * Create the mobile menu cloning the exiting menu.
 */
function groupMobileMenu() {
  // Create menu top level bucket
  const menus = document.querySelectorAll('ul#group-content-menu');
  menus.forEach((menu) => {
    createMenuBucket(menu);
  });

  const liList = [...document.querySelectorAll('.block-group-content-menu ul#group-content-menu-accordion .menu--level-1 li')];
  liList.forEach(li => {
    // if li has child ul element
    if ([...(li.children)].some(e => e.tagName === 'UL')) {
      cloneLi(li);

      li.children[0].addEventListener('click', menuItemClickEvent);
    }
  });
}

/**
 * Crate the container and inject the cloned menu.
 * @param menu
 */
function createMenuBucket(menu) {
  // Do a deep clone cleaning all extra styles.
  const deepMenuClone = cleanDeepClone(menu);
  // Create new top level ul.
  const topUl = document.createElement('ul');
  topUl.id = 'group-content-menu-accordion';
  topUl.classList = menu.classList;
  topUl.classList.remove('menu--level-1');
  topUl.classList.add('menu--level-0', 'group-mobile-menu');

  const topLi = document.createElement('li');
  topLi.classList = menu.children[0].classList;

  const topA = document.createElement('a');
  topA.classList = menu.children[0].children[0].classList;
  topA.classList.add('group-mobile-main-a');
  topA.innerHTML = 'Menu';

  topLi.appendChild(topA);
  topUl.appendChild(topLi);
  menu.parentNode.insertBefore(topUl, menu);
  // Append the cloned menu so we can target it with hide/show.
  topLi.appendChild(deepMenuClone);

  topA.addEventListener('click', menuItemClickEvent);
}

/**
 * Perform a deep clone and strip all inline styles applied.
 * @param menu
 * @returns Node
 */
function cleanDeepClone(menu) {
  const deepClone = menu.cloneNode(true);
  deepClone.removeAttribute("id");
  const deepCloneSubMenus = deepClone.querySelectorAll('ul');
  deepCloneSubMenus.forEach(deepCloneSubMenu => {
    deepCloneSubMenu.style.left = null;
  })
  return deepClone;
}

/**
 * Events for menu click on desktop.
 * @param event
 */
function menuItemClickEvent(event) {
  // prevent clicks from navigating to the html <a> element.
  event.preventDefault();

  // add styling and change text when clicked
  if (this.parentNode.classList.contains('group-menu-clicked')) {
    this.parentNode.classList.remove('group-menu-clicked');

    this.textContent = this.textContent.replace('Close ', '');
  } else {
    this.parentNode.classList.add('group-menu-clicked');

    const menuToggleText = this.textContent;
    this.textContent = `Close ${menuToggleText}`;
  }
}

/**
 *  Events for menu hover on desktop.
 * @param event
 */
function menuItemHoverEvent(event) {
  if (this.classList.contains('group-menu-hover') && this.mouseLeaveTimeout) {
    // prevent menu from hiding if the mouse leaves only for a moment
    clearTimeout(this.mouseLeaveTimeout);
  } else {
    this.classList.add('group-menu-hover');
  }
}

/**
 * Events for menu hover.
 * @param event
 */
function menuItemFocusinEvent(event) {
  if (!this.classList.contains('group-menu-hover')) {
    this.classList.add('group-menu-hover');
  }
}

/**
 * Event for when the mouse leaves.
 * @param event
 */
function menuItemMouseLeaveEvent(event) {
  const groupMenu = document.querySelectorAll('.block-group-content-menu')[0];
  if (this.classList.contains('group-menu-hover') && !event.currentTarget.contains(event.relatedTarget)) {
    // remove hover immediately if next target is still in the menu
    // otherwise wait a bit
    if (groupMenu.contains(event.relatedTarget)) {
      this.classList.remove('group-menu-hover');
    } else {
      this.mouseLeaveTimeout = setTimeout(() => {
        this.classList.remove('group-menu-hover');
      }, 800);
    }
  }
}

/**
 * Clone li and add to parent a element.
 * @param li
 */
function cloneLi(li) {
  const clonedA = li.children[0].cloneNode(true);
  const clonedLi = document.createElement('li');
  clonedLi.appendChild(clonedA);
  li.children[1].prepend(clonedLi);
}

/**
 * Check it user agent is a mobile agent.
 * @returns {RegExpMatchArray}
 */
function isMobile() {
  return navigator.userAgent.match(/(android|bb\d+|meego)|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i);
}

// Add event listener to browser resize.
window.addEventListener('resize', (event) => {
  if (window.innerWidth <= 768) {
    // only add mobile menu if it doesn't already exist.
    let groupMobileId = document.querySelector('#group-content-menu-accordion');
    let groupMenuId = document.querySelector('#group-content-menu');
    if (groupMobileId === null) {
      groupMobileMenu();
      groupMenuId.classList.add('d-none');
    } else {

      groupMenuId.classList.add('d-none');
      groupMobileId.classList.remove('d-none');
      groupMobileId.classList.add('d-flex');
    }
  } else {
    // add back desktop menu if mobile menu was added.
    let groupMobileId = document.querySelector('#group-content-menu-accordion');
    let groupMenuId = document.querySelector('#group-content-menu');
    if (groupMobileId !== null) {
      groupMobileId.classList.remove('d-flex');
      groupMobileId.classList.add('d-none');
      groupMenuId.classList.remove('d-none');
      groupMenuId.classList.add('d-flex');
    }
  }
});

/**
 * Resize the Menu provided to the largest item or our LargestEm constant.
 * @param menu
 */
function resizeMenu(menu) {
  menu.style.width = "auto";
  let menuUlMaxLength = 0;
  menu.querySelectorAll('li').forEach(menuLi => {
    menuLi.setAttribute('style', 'white-space:nowrap;');
    let largestItem = Math.ceil(menuLi.clientWidth / fontSize);
    if (largestItem < smallestEm) {
      menuUlMaxLength = smallestEm;
    } else if (largestItem > largestEm) {
      menuUlMaxLength = largestEm;
    } else {
      menuUlMaxLength = largestItem;
    }
    menuLi.setAttribute('style', '');
  });
  menu.style.width = `${menuUlMaxLength}em`;
}
