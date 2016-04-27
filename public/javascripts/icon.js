function removeHover(e) {
  if (e.id == 'remove-unit') {
    e.setAttribute('src', 'images/icons/close-dark-red.png');
  } else if (e.id == 'add-unit') {
    e.setAttribute('src', 'images/icons/plus-dark-green.png');
  } else if (e.id == 'expense-add') {
    e.setAttribute('src', 'images/icons/plus-circle-black.png');
  } else if (e.id == 'expense-remove') {
    e.setAttribute('src', 'images/icons/close-circle-black.png');
  } else if (e.id == 'expense-submit') {
    e.setAttribute('src', 'images/icons/plus-black.png');
  }
}
function removeUnhover(e) {
  if (e.id == 'remove-unit') {
    e.setAttribute('src', 'images/icons/close-black.png');
  } else if (e.id == 'add-unit') {
    e.setAttribute('src', 'images/icons/plus-black.png');
  } else if (e.id == 'expense-add') {
    e.setAttribute('src', 'images/icons/plus-circle-light-green.png');
  } else if (e.id == 'expense-remove') {
    e.setAttribute('src', 'images/icons/close-circle-red.png');
  } else if (e.id == 'expense-submit') {
    e.setAttribute('src', 'images/icons/plus-green.png');
  }
}
