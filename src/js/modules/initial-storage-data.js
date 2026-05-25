import { getCurrentPeriod } from "../common/functions";

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