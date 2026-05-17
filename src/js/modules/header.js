import { links, formProject, formEmployee, months, estIncomePerMonth } from '../common/lists';
import { getCurrentPeriod, clearDOM, createMyElement, createModal, noData, createConfirm, setBigTable } from '../common/functions';
import { createForm } from './form';
import { getContent } from './content';

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
  const trNoData = noData(6);

  const thYear = createMyElement('th', '', 'Year');
  const thMonth  = createMyElement('th', '', 'Month');
  const thProjects  = createMyElement('th', '', 'Projects');
  const thEmployees  = createMyElement('th', '', 'Employees');
  const thTotalEstIncome  = createMyElement('th', '', 'Total Est. Income');
  const thAction  = createMyElement('th', '', 'Action');

  tr.append(thYear, thMonth, thProjects, thEmployees, thTotalEstIncome, thAction);
  seedTable.append(tr, trNoData);

  if (localStorage.getItem('monthlyData')) {
    const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
    const currentPeriod = `${period.year}-${period.month}`;
    for (let key in monthlyData) {
      if (
        monthlyData[key].projects.length !== 0 ||
        monthlyData[key].employees.length !== 0
      ) {
        getContent(0, key);
        if (key !== currentPeriod) {
          if (seedTable.querySelector('.no-data')) {
            seedTable.removeChild(trNoData);
          }
          const [year, month] = key.split('-');
          const projectCount = String(monthlyData[key].projects.length);
          const employeeCount = String(monthlyData[key].employees.length);
          const total = estIncomePerMonth.getIncome(key);
          const incomeClass = total >= 0 ? 'profit' : 'loss';

          const tr = createMyElement('tr');
          const tdYear = createMyElement('td', '', year);
          const tdMonth = createMyElement('td', '', months[month]);
          const tdProject = createMyElement('td', '', projectCount);
          const tdEmployee = createMyElement('td', '', employeeCount);
          const tdTotal = createMyElement('td', `${incomeClass}`, `$${total.toFixed(2)}`);
          const tdAction = createMyElement('td');
          const seedButton = createMyElement('button', 'btn seed', 'Seed');

          seedButton.addEventListener('click', () => {
            document.body.append(createConfirm(`Copy data from ${months[month]} ${year} to ${period.period}?`));
              if (document.body.querySelector('.confirm')) {
                document.body.querySelector('.confirm').addEventListener('click', () => {
                  monthlyData[`${period.year}-${period.month}`] = monthlyData[key];
                  localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
                  const monthly = JSON.parse(localStorage.getItem('monthlyData'));
                  for (let employee in monthly[`${period.year}-${period.month}`].employees) {
                    monthly[`${period.year}-${period.month}`].employees[employee].vacationDays = []; 
                  }
                  localStorage.setItem('monthlyData', JSON.stringify(monthly));
                  getContent(0);
                  [...document.querySelectorAll('.overlay')].forEach((element) => document.body.removeChild(element));
                });
                document.body.querySelector('.cancel').addEventListener('click', () => {
                  document.body.removeChild(document.querySelectorAll('.overlay')[1]);
                });
              }
          });

          tdAction.append(seedButton);
          tr.append(tdYear, tdMonth, tdProject, tdEmployee, tdTotal, tdAction);
          seedTable.append(tr);
        }
      }
    }
  }

  const seedDataContent = {
    title: 'Seed Data from Month',
    content: seedTable,
    text: `Select a month to copy its data to the current month (${period.period}):`,
    item: 'seed-data'
  };
  const modal = createModal(seedDataContent);

  document.body.append(modal);
  getContent(0);
}

export function getHeader(page) {
  
  const header = document.querySelector('.header');
  clearDOM(header);
  const titleBlock = createMyElement('div');
  const btnBlock = createMyElement('div');
  const pageTitle = createMyElement('h1', 'page-title', page.title);

  const period = createMyElement('p', 'current-period', `period:  ${getCurrentPeriod().period}`);

  window.addEventListener('load', () =>
    period.textContent = `period:  ${getCurrentPeriod().period}`);
  document.querySelector('.months').addEventListener('change', () =>
    period.textContent = `period:  ${getCurrentPeriod().period}`);
  document.querySelector('.years').addEventListener('change', () =>
    period.textContent = `period:  ${getCurrentPeriod().period}`);
  
  titleBlock.append(pageTitle, period);

  for (let key in page.buttons) {
    const btn = page.buttons[key]();

    btn.addEventListener('click', () => {
      if (key === 'seedData') {
        makeSeedData(getCurrentPeriod());
        setBigTable();
      } else {
        addButtons(key);
      }
    });

    btnBlock.append(btn);
  }

  header.append(titleBlock, btnBlock);
}

links.filter((link) => link.default ? getHeader(link) : '');