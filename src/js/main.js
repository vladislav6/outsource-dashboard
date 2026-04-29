import '../scss/main.scss';
import { getCurrentPeriod } from './common/functions';

import.meta.glob('./modules/*.js', {eager: true});

function setDataToLocalStorage() {
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
      }
      localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
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
  }

});

document.querySelector('.months').addEventListener('change', setDataToLocalStorage);
document.querySelector('.years').addEventListener('change', setDataToLocalStorage);

window.addEventListener('unload', () => {
  const month = getCurrentPeriod().month;
  const year = getCurrentPeriod().year;
  const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));

  for (let key in monthlyData) {
    if (
      monthlyData[key].projects.length === 0 &&
      monthlyData[key].employees.length === 0
      ) {
      delete monthlyData[key];
    }
  }
  localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
});