import { links, formProject, formEmployee } from '../common/lists';
import { getCurrentPeriod, clearDOM, createMyElement, createForm, createModal } from '../common/functions';

function addButtons(button) {
  const asidePanel = document.querySelector('.aside-right');
  asidePanel.classList.remove('no-smooth');
  asidePanel.classList.add('show');
  let panelContent = createMyElement('div');
  let panelTitle = createMyElement('h2', 'panel-title', '');
  switch (button) {
    case 'addProject':
    panelContent = createForm('project', formProject);
    panelTitle.textContent = 'Add New Project';
    break;
    case 'addEmployee':
      panelContent = createForm('employee', formEmployee);
      panelTitle.textContent = 'Add New Employee';
      break;
  }
  clearDOM(asidePanel);
  const closeAside = createMyElement('button', 'close-aside', 'X');
  asidePanel.append(closeAside, panelTitle, panelContent);
  closeAside.addEventListener('click', () => asidePanel.classList.toggle('show'));
}

export function makeSeedData(period) {
  const seedTable = createMyElement('table', 'table');
  const tr = createMyElement('tr');

  const thYear = createMyElement('th', '', 'Year');
  const thMonth  = createMyElement('th', '', 'Month');
  const thProjects  = createMyElement('th', '', 'Projects');
  const thEmployees  = createMyElement('th', '', 'Employees');
  const thTotalEstIncome  = createMyElement('th', '', 'Total Est. Income');
  const thAction  = createMyElement('th', '', 'Action');

  tr.append(thYear, thMonth, thProjects, thEmployees, thTotalEstIncome, thAction)
  seedTable.append(tr);

  const seedDataContent = {
    title: 'Seed Data from Month',
    content: seedTable,
    text: `Select a month to copy its data to the current month (${period.month} ${period.year}):`
  };
  const modal = createModal(seedDataContent);

  document.body.append(modal);
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
    const btn = page.buttons[key]();

    btn.addEventListener('click', () => key === 'seedData' ? makeSeedData(getCurrentPeriod()) : addButtons(key));
    btnBlock.append(btn);
  }

  header.append(titleBlock, btnBlock);
}

links.filter((link) => link.default ? getHeader(link) : '');