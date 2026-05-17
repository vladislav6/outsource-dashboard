import { createMyElement, noData, createConfirm, getNumber, getEmployeeCurrentCapacity, setBigTable } from "../common/functions";
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

  const employeeProjectData = {};
  const projectData = {};
  if (localStorage.getItem('monthlyData')) {
    const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
    if (monthlyData.hasOwnProperty(`${year}-${month}`)) {

      let employees = monthlyData[`${year}-${month}`].employees;
      const projects = monthlyData[`${year}-${month}`].projects;
      if (employees.length !== 0) {
        for (let key in employees) {
          const {
            id,
            name,
            surname,
            dob,
            position,
            salary,
            assignments,
            vacationDays
          } = employees[key];

          const age = getAge(dob);
          const currentCapacityEmployee = getEmployeeCurrentCapacity(assignments);
          const maxCapacity = 1.5;
          const capacity = Math.max(0.5, currentCapacityEmployee);
          const payment = getNumber(salary * capacity);
          const assignmentCount = assignments.length;

          const tr = createMyElement('tr');
          const tdName = createMyElement('td', '', name);
          const tdSurname = createMyElement('td', '', surname);
          const tdAge = createMyElement('td', '', age);
          const tdPosition = createMyElement('td', '', position);
          const tdSalary = createMyElement('td', '', `$${salary}`);
          const tdPayment = createMyElement('td', '', `$${payment}`);
          const tdAssignments = createMyElement('td');

          let showAssignments = '-';
          const overlayAssignments = getDetailsTable({
            modalTitle: `Assignments for ${name} ${surname}`,
            thTitle: 'Project',
            assign: assignments,
            projects,
            employees,
            year,
            month
          });

          if (assignmentCount > 0 ) {
            showAssignments = createMyElement('button', 'btn assignments', 'Show');
            const assignmentDetails = `Assignments ${assignmentCount} and employee capacity ${currentCapacityEmployee} / ${maxCapacity}`;
            showAssignments.addEventListener('click', () => {
              document.body.append(overlayAssignments.overlay);
              setBigTable();
            });
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

          let projectedIncome = 0;
          projectedIncome += overlayAssignments.profit;
          const incomeClass = projectedIncome >= 0 ? 'profit' : 'loss';

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
                if (employees[key].id === employeeId) {
                  employees[key] = '';
                  monthlyData[`${year}-${month}`].employees = employees.filter((employee) => employee !== '');
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
            assignments: assignments.map((a) => a.projectId),
            projects,
            employees,
            monthlyData,
            year,
            month,
            key,
            id
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
            month,
            monthlyData,
            vacation: vacationDays,
            key
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
            !e.target.classList.contains('assign') &&
            !document.querySelector('.overlay')
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