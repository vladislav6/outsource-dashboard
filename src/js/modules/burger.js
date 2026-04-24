const burger = document.querySelector('.burger');
const nav = document.querySelector('.navigation');

burger.addEventListener('click', () => {
  nav.classList.toggle('hide');
  if (nav.classList.contains('hide')) {
    document.querySelector('.header').style.paddingLeft = '80px';
  } else {
    document.querySelector('.header').removeAttribute('style');
  }
});

window.addEventListener('resize', () => {
  if (!nav.classList.contains('hide')) {
    if (document.body.clientWidth < 725) {
      nav.classList.add('hide');
      document.querySelector('.header').style.paddingLeft = '80px';
    }
  }
});