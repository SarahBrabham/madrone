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

/**
 *
 * @param sfToggle
 */
function menuClickedText(sfToggle) {
  console.log(sfToggle);
  if (sfToggle.classList.contains('sf-expanded')) {
    let menuToggleText = sfToggle.textContent;
    sfToggle.textContent = `Close ${menuToggleText}`;
  } else {
    sfToggle.textContent = sfToggle.textContent.replace('Close ', '');
  }
}
