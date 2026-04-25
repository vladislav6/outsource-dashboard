import { links } from '../common/lists';
import { getCurrentPeriod, clearDOM, createMyElement, makeSeedData, createForm } from '../common/functions';

function headerButtons(button) {
  const asidePanel = document.querySelector('.aside-right');
  asidePanel.classList.add('show');
  let panelContent = createMyElement('div');
  switch (button) {
    case 'seedData': panelContent = makeSeedData(getCurrentPeriod()); break;
    case 'addProject': panelContent = createForm(); break;
    case 'addEmployee': panelContent = createForm(); break;
  }
  clearDOM(asidePanel);
  const closeAside = createMyElement('button', 'close-aside', 'X');
  asidePanel.append(closeAside, panelContent);
  closeAside.addEventListener('click', () => asidePanel.classList.toggle('show'));
}

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
    const btn = page.buttons[key];

    btn.addEventListener('click', () => headerButtons(key));
    btnBlock.append(btn);
  }

  header.append(titleBlock, btnBlock);

  return header;
}

links.filter((link) => link.default ? getHeader(link) : '');