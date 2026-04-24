import { links } from '../common/lists';
import { getCurrentPeriod, clearDOM } from '../common/functions';

export function getHeader(page) {
  
  const header = document.querySelector('.header');
  clearDOM(header);
  const titleBlock = document.createElement('div');
  const btnBlock = document.createElement('div');
  const pageTitle = document.createElement('h1');
  pageTitle.classList.add('page-title');
  pageTitle.textContent = page.title;

  const period = document.createElement('p');
  period.classList.add('current-period');
  period.textContent = getCurrentPeriod().period;

  window.addEventListener('load', () =>
    period.textContent = getCurrentPeriod().period);
  document.querySelector('.months').addEventListener('change', () =>
    period.textContent = getCurrentPeriod().period);
  document.querySelector('.years').addEventListener('change', () =>
    period.textContent = getCurrentPeriod().period);
  
  titleBlock.append(pageTitle, period);

  if (page.id === 0) {
    const btnAddProject = page.buttons.addProject();
    const btnSeedData = page.buttons.seedData();
    
    btnBlock.append(btnSeedData, btnAddProject);
  }
  if (page.id === 1) {
    const btnAddEmployees = page.buttons.addEmployees();
    btnBlock.append(btnAddEmployees);
  }

  header.append(titleBlock, btnBlock);

  return header;
}

getHeader(links[0]);

