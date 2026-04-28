import { links, formProject, formEmployee } from '../common/lists';
import { getCurrentPeriod, clearDOM, createMyElement, createModal } from '../common/functions';
import { createForm } from './form';

const asidePanel = document.querySelector('.aside-right');

function addButtons(button) {
  if (!asidePanel.hasChildNodes() ) {
    asidePanel.classList.remove('no-smooth');
    asidePanel.classList.add('show');
    const formPanel = button === 'addProject' ? formProject : formEmployee;
    const formClass = button === 'addProject' ? 'project-form' : 'employee-form';
    const formTitle = button === 'addProject' ? 'Add New Project' : 'Add New Employee';
    
    const panelContentProject = createForm(formPanel, formClass, asidePanel);
    const panelTitleProject = createMyElement('h2', 'panel-title', formTitle);
    
    asidePanel.append(panelTitleProject, panelContentProject);
  }
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