import { drawContentTable, getAge } from "../common/functions";

const removeSort = (selectors) => {
  [...selectors].forEach((element) => {
    if (element.classList.contains('up') || element.classList.contains('down')) {
      element.classList.remove('up');
      element.classList.remove('down');
    }
  });
};

function getSort(data, column, ascending) {
  return data.sort((a, b) => {
    let valueA = a[column];
    let valueB = b[column];

    if (column === 'dob') {
      return ascending
        ? getAge(valueA) - getAge(valueB)
        : getAge(valueB) - getAge(valueA);
    }

    if (column === 'position') {
      const positionPriority = {
        'Junior': 0,
        'Middle': 1,
        'Senior': 2,
        'Lead': 3,
        'Architect': 4,
        'BO': 5
      };
      return ascending
        ? positionPriority[valueA] - positionPriority[valueB]
        : positionPriority[valueB] - positionPriority[valueA];
    }

    if (column === 'salary') {
      return ascending
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    }

    valueA = String(valueA).toLowerCase();
    valueB = String(valueB).toLowerCase();

    return ascending 
      ? valueA.localeCompare(valueB, 'en')
      : valueB.localeCompare(valueA, 'en');
  });
}

export function sortableTool(aboutSort) {
const {
  target,
  table,
  trThs,
  pageId,
  year,
  month,
  employees,
  projects,
  monthlyData
} = aboutSort;
  
  const ascending = !target.classList.contains('up');
  const column = target.getAttribute('data-column');
  let projectSort = projects;
  let employeeSort = employees;

  if (pageId === 0) {
    projectSort = getSort(projects, column, ascending);
  } else {
    employeeSort = getSort(employees, column, ascending);
  }

  drawContentTable({
    isDrawTable: true,
    employees: employeeSort,
    projects: projectSort,
    table,
    trThs,
    pageId,
    year,
    month,
    monthlyData
  });

  const selectors = [...document.querySelectorAll('.sortable')].filter((f) => f !== target);
  removeSort(selectors);
  if (target.classList.contains('up')) {
    target.classList.remove('up');
    target.classList.add('down');
  } else {
    target.classList.remove('down');
    target.classList.add('up');
  }
}