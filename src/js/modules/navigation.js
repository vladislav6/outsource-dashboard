import { links as pages } from '../common/lists';
import { getHeader } from './header';

function addLinksToNav(linksList) {
  const links = document.querySelector('.links');

  linksList.forEach((link, index) => {
    const liElement = document.createElement('li');
    liElement.textContent = link.title;
    liElement.setAttribute('data-id', index);
    liElement.className = 'link';
    if (link.default) {
      liElement.classList.add('active');
    }

    links.append(liElement);
  });
}

function switchPage (links) {
  const linkArr = [...links];
  linkArr.forEach((link) => {
    link.addEventListener('click', (e) => {
      linkArr.map((link) => link.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const linkId = e.currentTarget.getAttribute('data-id');
      getHeader(pages[linkId]);
    });
  });
}

addLinksToNav(pages);
switchPage(document.querySelectorAll('.link'));