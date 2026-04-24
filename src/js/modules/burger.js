const burger = document.querySelector('.burger');
const nav = document.querySelector('.navigation');

burger.addEventListener('click', () => {
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