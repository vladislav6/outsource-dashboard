const burger = document.querySelector('.burger');
const nav = document.querySelector('.navigation');

burger.addEventListener('click', () => {
  document.querySelector('.main').removeAttribute('style');
  nav.classList.toggle('hide');
  if (nav.classList.contains('hide')) {
    document.querySelector('.header').style.paddingLeft = '80px';
    document.querySelector('.main').classList.add('main-full-width');
  } else {
    document.querySelector('.header').removeAttribute('style');
    document.querySelector('.main').classList.remove('main-full-width');
  }
});

window.addEventListener('resize', () => {
  document.querySelector('.main').style.transition = '0s';
  if (!nav.classList.contains('hide')) {
    if (document.body.clientWidth < 810) {
      nav.classList.add('hide');
      document.querySelector('.header').style.paddingLeft = '80px';
      document.querySelector('.main').classList.remove('main-full-width');
    }
  } else {
    document.querySelector('.main').classList.add('main-full-width');
  }
});