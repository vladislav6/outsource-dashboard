import { links as pages } from '../common/lists';
import { createMyElement, clearDOM } from '../common/functions';
import { getHeader } from './header';
import { getContent } from './content';

function addLinksToNav(linksList) {
  const links = document.querySelector('.links');

  linksList.forEach((link, index) => {
    const liElement = createMyElement('li', 'link', link.title);
    liElement.setAttribute('data-id', index);
    
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
      const linkId = Number(e.currentTarget.getAttribute('data-id'));
      getHeader(pages[linkId]);
      getContent(linkId);
      if (document.querySelector('.aside-right')) {
        const asidePanel = document.querySelector('.aside-right');
        asidePanel.classList.remove('show');
        clearDOM(asidePanel);
      }
    });
  });
}

addLinksToNav(pages);
switchPage(document.querySelectorAll('.link'));