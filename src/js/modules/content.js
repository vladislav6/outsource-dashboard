import { projectTable } from "./projects";
import { employeeTable } from "./employees";
import { links } from "../common/lists";
import { clearDOM, createMyElement, getCurrentPeriod } from "../common/functions";

export function setDataToLocalStorage() {
  if (localStorage.getItem('monthlyData')) {
    const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
    const month = getCurrentPeriod().month;
    const year = getCurrentPeriod().year;
    for (let key in monthlyData) {
      if (
        monthlyData[key].projects.length === 0 &&
        monthlyData[key].employees.length === 0
      ) {
        delete monthlyData[key];
      }
    }
    if (!monthlyData.hasOwnProperty(`${year}-${month}`)) {
      monthlyData[`${year}-${month}`] = {
        projects: [],
        employees: []
      };
      localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
    }
  }
}

document.querySelector('.months').addEventListener('change', setDataToLocalStorage);
document.querySelector('.years').addEventListener('change', setDataToLocalStorage);

window.addEventListener('pagehide', () => {
  const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
  for (let key in monthlyData) {
    if (
      monthlyData[key].projects.length === 0 &&
      monthlyData[key].employees.length === 0
      ) {
      delete monthlyData[key];
    }
  }
  Object.keys(monthlyData).length !== 0 ?
    localStorage.setItem('monthlyData', JSON.stringify(monthlyData)) :
    localStorage.removeItem('monthlyData');
});

window.addEventListener('load', () => {
  const month = getCurrentPeriod().month;
  const year = getCurrentPeriod().year;
  const initialData = {
    [`${year}-${month}`]: {
      projects: [],
      employees: []
    }
  };
  if (!localStorage.getItem('monthlyData')) {
    localStorage.setItem('monthlyData', JSON.stringify(initialData));
  } else {
    const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
    if (!monthlyData.hasOwnProperty(`${year}-${month}`)) {
      Object.assign(monthlyData, initialData);
      localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
    }
  }
});

export function getContent(pageId) {
  const main = document.querySelector('.main');
  clearDOM(main);
  const month = getCurrentPeriod().month;
  const year = getCurrentPeriod().year;
  
  const table = pageId === 0 ? projectTable(year, month) : employeeTable(year, month);
  if (pageId === 0) {

    const totalEstIncome = [...table.querySelectorAll('.income')].reduce((acc, tdElement) => {
      const income = Number(tdElement.textContent.slice(1));
      return acc += income;
    }, 0);

    const incomeClass = totalEstIncome >= 0 ? 'profit' : 'loss';

    const totalIncome = createMyElement('p', 'total-income', 'Total Estimated Income: ');
    const total = createMyElement('span', `total ${incomeClass}`, `$${totalEstIncome.toFixed(2)}`);
    totalIncome.append(total);
    main.append(totalIncome);
  }
  main.prepend(table);
}

document.querySelector('.months').addEventListener('change', () => {
  const linkId = Number(document.querySelector('.active').getAttribute('data-id'));
  getContent(linkId)
});

document.querySelector('.years').addEventListener('change', () => {
  const linkId = Number(document.querySelector('.active').getAttribute('data-id'));
  getContent(linkId)
});

links.forEach((link) => {
  if (link.default) {
    window.addEventListener('load', () => getContent(link.id));
  }
});