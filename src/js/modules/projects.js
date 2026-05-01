import { createMyElement, noData, createConfirm } from "../common/functions";
import { getContent, setDataToLocalStorage } from './content';

export function projectTable(year, month) {
  const table = createMyElement('table', 'table');
  const tr = createMyElement('tr');
  
  const thNameCompany = createMyElement('th', 'sortable filterable', 'Company name');
  const thNameProject = createMyElement('th', 'sortable filterable', 'Project name');
  const thBudget = createMyElement('th', 'sortable', 'Budget');
  const thEmployeeCapacity = createMyElement('th', 'sortable', 'Employee Capacity');
  const thEmployees = createMyElement('th', '', 'Employees');
  const thEstimatedIncome = createMyElement('th', 'sortable', 'Estimated Income');
  const thActions = createMyElement('th', '', 'Action');

  tr.append(thNameCompany, thNameProject, thBudget, thEmployeeCapacity, thEmployees, thEstimatedIncome, thActions);

  table.append(tr);

  if (localStorage.getItem('monthlyData')) {
    const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
    if (monthlyData.hasOwnProperty(`${year}-${month}`)) {
      if (monthlyData[`${year}-${month}`].projects.length !== 0) {
        for (let key in monthlyData[`${year}-${month}`].projects) {
          const {
            id,
            project,
            company,
            budget,
            capacity
          } = monthlyData[`${year}-${month}`].projects[key];

          const currentCapacity = 0;
          const currentIncome = 0;
          const incomeClass = currentIncome >= 0 ? 'profit' : 'loss';

          const tr = createMyElement('tr');
          const tdCompany = createMyElement('td', '', company);
          const tdProject = createMyElement('td', '', project);
          const tdBudget = createMyElement('td', '', `$${Number(budget).toFixed(2)}`);
          const tdCapacity = createMyElement('td', '', `${currentCapacity.toFixed(1)}/${capacity}`);
          const tdEmployees = createMyElement('td', '', '-');
          const tdIncome = createMyElement('td', `income ${incomeClass}`, `$${currentIncome.toFixed(2)}`);
          const tdActions = createMyElement('td');
          const deleteProject = createMyElement('button', 'btn delete', 'Delete');

          deleteProject.setAttribute('data-id', id);

          deleteProject.addEventListener('click', (e) => {
            document.body.append(createConfirm(`Are you sure you want to delete ${project} project?`));
            if (document.body.querySelector('.confirm')) {
              document.body.querySelector('.confirm').addEventListener('click', () => {
                const projectId = e.target.getAttribute('data-id');
                if (monthlyData[`${year}-${month}`].projects[key].id === projectId) {
                  monthlyData[`${year}-${month}`].projects[key] = '';
                  monthlyData[`${year}-${month}`].projects =
                    monthlyData[`${year}-${month}`].projects.filter((project) => project !== '');
                  localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
                  getContent(0);
                  document.body.removeChild(document.querySelector('.overlay'));
                }
              });
              document.body.querySelector('.cancel').addEventListener('click', () => {
                document.body.removeChild(document.querySelector('.overlay'));
              });
            }
          });

          tdActions.append(deleteProject);
          tr.append(tdCompany, tdProject, tdBudget, tdCapacity, tdEmployees, tdIncome, tdActions);
          table.append(tr);
        }
      } else {
        const trNoData = noData(7);
        table.append(trNoData);
      }
    }
  }

  return table;
}