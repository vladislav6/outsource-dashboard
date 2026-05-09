import { createMyElement, noData, createConfirm, getNumber } from "../common/functions";
import { getContent } from "./content";
import { makeAssign } from "./assignments";
import { getDetailsTable } from "./details";
import { makeAvailability } from "./availability";

function getAge(date) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  const [year, month, day] = date.split('-').map((n) => Number(n));

  let age = currentYear - year;
  if (currentMonth < month - 1) {
    age -= 1;
  } else if (currentMonth === month - 1) {
    if (currentDay < day) {
      age -= 1;
    }
  }

  return age;
}

export function employeeTable(year, month) {
  const table = createMyElement('table', 'table');
  const tr = createMyElement('tr');
  
  const thName = createMyElement('th', 'sortable filterable', 'Name');
  const thSurname = createMyElement('th', 'sortable filterable', 'Surname');
  const thAge = createMyElement('th', 'sortable', 'Age');
  const thPosition = createMyElement('th', 'sortable filterable', 'Position');
  const thSalary = createMyElement('th', 'sortable', 'Salary');
  const thEstimatedPayment = createMyElement('th', 'sortable', 'Estimated Payment');
  const thProject = createMyElement('th', 'sortable filterable', 'Project');
  const thProjectedIncome = createMyElement('th', 'sortable', 'Projected Income');
  const thActions = createMyElement('th', '', 'Actions');

  tr.append(thName, thSurname, thAge, thPosition, thSalary, thEstimatedPayment, thProject, thProjectedIncome, thActions);
  table.append(tr);

  if (localStorage.getItem('monthlyData')) {
    const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
    if (monthlyData.hasOwnProperty(`${year}-${month}`)) {
      if (monthlyData[`${year}-${month}`].employees.length !== 0) {
        for (let key in monthlyData[`${year}-${month}`].employees) {
          const {
            id,
            name,
            surname,
            dob,
            position,
            salary,
            assignments,
            vacationDays
          } = monthlyData[`${year}-${month}`].employees[key];

          const age = getAge(dob);
          const currentCapacityEmployee = assignments.length !== 0 ?
            getNumber(assignments.reduce((acc, assignEmpl) => acc += getNumber(assignEmpl.capacity), 0)) : 0.0;
          const maxCapacity = 1.5;
          const capacity = Math.max(0.5, currentCapacityEmployee);
          const payment = getNumber(salary * capacity);
          const assignmentCount = assignments.length;

          function getDetailsBtnHandler() {
            return getDetailsTable({
              modalTitle: 'Assignments for',
              thTitle: 'Project',
              name: `${name} ${surname}`,
              item: 'employee-assignments',
              salary,
              assign: assignments,
              vacation: vacationDays,
              projects: monthlyData[`${year}-${month}`].projects,
              employees: monthlyData[`${year}-${month}`].employees
            });
          }

          let projectedIncome = 0;
          projectedIncome = projectedIncome + getDetailsBtnHandler().profit;
          document.body.removeChild(document.querySelector('.overlay'));
          const incomeClass = projectedIncome >= 0 ? 'profit' : 'loss';

          const tr = createMyElement('tr');
          const tdName = createMyElement('td', '', name);
          const tdSurname = createMyElement('td', '', surname);
          const tdAge = createMyElement('td', '', age);
          const tdPosition = createMyElement('td', '', position);
          const tdSalary = createMyElement('td', '', `$${salary}`);
          const tdPayment = createMyElement('td', '', `$${payment}`);
          const tdAssignments = createMyElement('td');

          let showAssignments = '-';
          if (assignmentCount > 0 ) {
            showAssignments = createMyElement('button', 'btn assignments', 'Show');

            const assignmentDetails = `Assignments ${assignmentCount} and employee capacity ${currentCapacityEmployee} / ${maxCapacity}`;

            showAssignments.addEventListener('click', getDetailsBtnHandler);

            showAssignments.addEventListener('mouseover', (e) => {
              const rect = e.target.getBoundingClientRect();
              const tooltip = createMyElement('div', 'tooltip', assignmentDetails);
              document.body.append(tooltip);
              tooltip.style.position = 'absolute';
              tooltip.style.top = `${rect.top + rect.height + 10}px`;
              tooltip.style.left = `${rect.left - (tooltip.offsetWidth / 2) + (rect.width / 2)}px`;
            });
            showAssignments.addEventListener('mouseout', (e) => {
              document.body.removeChild(document.querySelector('.tooltip'));
            });
          }

          const tdIncome = createMyElement('td', `${incomeClass}`, `$${projectedIncome.toFixed(2)}`);
          const tdActions = createMyElement('td', 'actions');
          const availability = createMyElement('button', 'btn availability', 'Availability');
          const assign = createMyElement('button', `btn assign`, 'Assign');
          if (currentCapacityEmployee === maxCapacity) {
            assign.disabled = true;
            assign.classList.add('disable');
          }
          const deleteEmployee = createMyElement('button', 'btn delete', 'Delete');

          deleteEmployee.setAttribute('data-id', id);
          deleteEmployee.addEventListener('click', (e) => {
            document.body.append(createConfirm(`Are you sure you want to delete ${name} ${surname} employee?`));
            if (document.body.querySelector('.confirm')) {
              document.body.querySelector('.confirm').addEventListener('click', () => {
                const employeeId = e.target.getAttribute('data-id');
                if (monthlyData[`${year}-${month}`].employees[key].id === employeeId) {
                  monthlyData[`${year}-${month}`].employees[key] = '';
                  monthlyData[`${year}-${month}`].employees =
                    monthlyData[`${year}-${month}`].employees.filter((employee) => employee !== '');
                  localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
                  getContent(1);
                  document.body.removeChild(document.querySelector('.overlay'));
                }
              });
              document.body.querySelector('.cancel').addEventListener('click', () => {
                document.body.removeChild(document.querySelector('.overlay'));
              });
            }
          });

          const aboutPopup = {
            fullName: `${name} ${surname}`,
            currentCapacityEmployee,
            maxCapacity,
            projects: monthlyData[`${year}-${month}`].projects,
            employees: monthlyData[`${year}-${month}`].employees,
            monthlyData,
            year,
            month,
            key
          };

          assign.addEventListener('click', () => {
            if (document.querySelector('.popup')) {
              document.body.removeChild(document.querySelector('.popup'));
              makeAssign(assign.getBoundingClientRect(), aboutPopup);
            } else {
              makeAssign(assign.getBoundingClientRect(), aboutPopup);
            }
          });
          
          availability.addEventListener('click', () => makeAvailability({
            name: `${name} ${surname}`,
            year,
            month
          }));

          tdAssignments.append(showAssignments);
          tdActions.append(availability, assign, deleteEmployee);
          tr.append(tdName, tdSurname, tdAge, tdPosition, tdSalary, tdPayment, tdAssignments, tdIncome, tdActions);
          table.append(tr);
        }

        document.addEventListener('click', (e) => {
          if (
            document.querySelector('.popup') &&
            !document.querySelector('.popup').contains(e.target) &&
            !e.target.classList.contains('assign')
          ) {
            document.body.removeChild(document.querySelector('.popup'));
          } 
        });
        
      } else {
        const trNoData = noData(9);
        table.append(trNoData);
      }
    }
  }

  return table;
}