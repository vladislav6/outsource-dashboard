import { links } from '../common/lists';
import { getCurrentPeriod, clearDOM, createMyElement } from '../common/functions';

export function getHeader(page) {
  
  const header = document.querySelector('.header');
  clearDOM(header);
  const titleBlock = createMyElement('div');
  const btnBlock = createMyElement('div');
  const pageTitle = createMyElement('h1', 'page-title', page.title);

  const period = createMyElement('p', 'current-period', getCurrentPeriod().period );

  window.addEventListener('load', () =>
    period.textContent = getCurrentPeriod().period);
  document.querySelector('.months').addEventListener('change', () =>
    period.textContent = getCurrentPeriod().period);
  document.querySelector('.years').addEventListener('change', () =>
    period.textContent = getCurrentPeriod().period);
  
  titleBlock.append(pageTitle, period);

  for (let key in page.buttons) {
    const btn = page.buttons[key]();

     btnBlock.append(btn);
  }

  header.append(titleBlock, btnBlock);

  return header;
}

links.filter((link) => link.default ? getHeader(link) : '');