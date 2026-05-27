import { createMyElement, noData, createConfirm, getEmployeeAssignmentsCountCapacity, getAllAssignments, setBigTable } from "../common/functions";
import { getContent } from './content';
import { getDetailsTable } from "./details";


export function projectTable(year, month, isDrawTable, monthlyData, employees, projects) {
  const trTds = [];
  let totalIncome = 0;
  const countCapacity = getEmployeeAssignmentsCountCapacity(employees);
  const counts = {};
  const assignments = getAllAssignments(employees);
  assignments.forEach(assign => assign ? counts[assign.projectId] = (counts[assign.projectId] || 0) + 1 : '');

  if (projects && projects.length !== 0) {
    for (let key in projects) {
      const {
        id,
        project,
        company,
        budget,
        capacity
      } = projects[key];

      const currentCapacity = countCapacity[id] ? countCapacity[id] : 0;

      const overlay = getDetailsTable({
        modalTitle: `Employees on ${project}`,
        thTitle: 'Employee',
        assign: assignments.filter((f) => f.projectId === id),
        projects,
        employees,
        year,
        month
      });

      totalIncome += overlay.profit;
      const incomeClass = overlay.profit >= 0 ? 'profit' : 'loss';

      const tr = createMyElement('tr');
      const tdCompany = createMyElement('td', '', company);
      const tdProject = createMyElement('td', '', project);
      const tdBudget = createMyElement('td', '', `$${Number(budget).toFixed(2)}`);
      const tdCapacity = createMyElement('td', '', `${currentCapacity.toFixed(1)} / ${capacity}`);
      const tdEmployees = createMyElement('td');
      const tdIncome = createMyElement('td', `income ${incomeClass}`, `$${overlay.profit.toFixed(2)}`);
      const tdActions = createMyElement('td');
      const deleteProject = createMyElement('button', 'btn delete', 'Delete');

      if (counts[id]) {
        const employeeBtn = createMyElement(
          'button',
          'btn assignments',
          `Employees (${counts[id]})`
        );

        employeeBtn.addEventListener('click', () => {
          document.body.append(overlay.overlay);
          setBigTable();
        });
        tdEmployees.append(employeeBtn);
      } else {
        tdEmployees.append('-');
      }

      deleteProject.setAttribute('data-id', id);

      deleteProject.addEventListener('click', (e) => {
        document.body.append(createConfirm(`Are you sure you want to delete ${project} project?`));
        if (document.body.querySelector('.confirm')) {
          document.body.querySelector('.confirm').addEventListener('click', () => {
            const projectId = e.target.getAttribute('data-id');
            if (projects[key].id === projectId) {
              projects[key] = '';
              monthlyData[`${year}-${month}`].projects = projects.filter((project) => project !== '');

              employees.forEach((employee, index) => {
                employee.assignments.forEach((assign, ind) => {
                  if (assign && Object.values(assign).includes(projectId)) {
                    delete employee.assignments[ind];
                    employees[index].assignments = employee.assignments.filter((assign) => assign.projectId !== projectId);
                  }
                });
              });

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
      trTds.push(tr);
    }
  } else {
    const trNoData = noData(7);
    trTds.push(trNoData);
  }

  return isDrawTable ? trTds : totalIncome;
}