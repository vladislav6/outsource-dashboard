import { projectTable } from "./projects";
import { links, estIncomePerMonth } from "../common/lists";
import { createMyElement, getCurrentPeriod, cancelEdit, drawContentTable, clearDOM, removeTooltip } from "../common/functions";
import { employeeHeadTable } from "./employee-head-table";
import { projectHeadTable } from "./project-head-table";
import { sortableTool } from "./sortable";
import { filterableTool } from "./filterable";
import { editableTool } from "./editable";

if (document.querySelector('.overlay .table')) {
  const rect = document.querySelector('.overlay .table').getBoundingClientRect();
  if (rect.height + rect.x > document.body.offsetHeight) {
    document.querySelector('.modal').classList.add('big-table');
  }
}

export function getContent(pageId, key = '') {
  const main = document.querySelector('.main');
  clearDOM(main);
  let year = 0;
  let month = 0;
  let isDrawTable = true;
  if (key) {
    const per = key.split('-');
    year = Number(per[0]);
    month = Number(per[1]);
    isDrawTable = false;
  } else {
    month = getCurrentPeriod().month;
    year = getCurrentPeriod().year;
  }

  if (localStorage.getItem('monthlyData')) {
    const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
    if (monthlyData.hasOwnProperty(`${year}-${month}`)) {

      let employees = monthlyData[`${year}-${month}`].employees;
      const projects = monthlyData[`${year}-${month}`].projects;

      if(!isDrawTable) {
        estIncomePerMonth.setIncome(`${year}-${month}`, projectTable(year, month, isDrawTable, monthlyData, employees, projects));
      } else {
        const table = createMyElement('table', 'table');
        const trThs = pageId === 0 ? projectHeadTable() : employeeHeadTable();
        
        const fullTable = drawContentTable({
          table,
          trThs,
          pageId,
          year,
          month,
          isDrawTable,
          employees,
          projects,
          monthlyData
        });

        main.append(fullTable);
        
        table.addEventListener('click', (e) => {
          if (e.target.classList.contains('sortable')) {
            sortableTool({
              target: e.target,
              table,
              trThs,
              pageId,
              year,
              month,
              monthlyData
            });
          }

          if (e.target.classList.contains('filterable')) {
            filterableTool({
              target: e.target,
              table,
              trThs,
              pageId,
              year,
              month,
              employees,
              projects,
              monthlyData
            });
          }

          if (e.target.classList.contains('editable')) {
            editableTool({
              target: e.target,
              monthlyData,
              year,
              month
            });
          }
        });

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

        document.addEventListener('click', (e) => {
          if (
            document.querySelector('.popup') &&
            !document.querySelector('.popup').contains(e.target) &&
            !e.target.classList.contains('assign') &&
            !document.querySelector('.overlay')
          ) {
            document.body.removeChild(document.querySelector('.popup'));
          }
          if (!e.target.classList.contains('position')) {
            cancelEdit('.select-position');
          }
          if (!e.target.classList.contains('salary')) {
            if (!e.target.classList.contains('input-salary')) {
              cancelEdit('.input-salary');
            }
          }

          if (
            document.querySelector('.filter-tooltip') &&
            !e.target.classList.contains('filterable-input') &&
            !e.target.classList.contains('filterable-btn') &&
            !e.target.classList.contains('filter-tooltip') &&
            !e.target.classList.contains('filterable')
          ) {
            removeTooltip(null, 'filter-tooltip');
          }
        });
      }
    }
  }
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