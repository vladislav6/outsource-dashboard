import {
  createMyElement, noData, createConfirm, getEmployeeCurrentCapacity,
  getNumber, setBigTable, createTooltip, removeTooltip, getAge
} from "../common/functions";
import { getContent } from "./content";
import { makeAssign } from "./assignments";
import { getDetailsTable } from "./details";
import { makeAvailability } from "./availability";

export function employeeTable(year, month, monthlyData, employees, projects) {
  const trs = [];
  if (employees && employees.length !== 0) {
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
      const tdPosition = createMyElement('td', `position editable`, position);
      tdPosition.setAttribute('data-key', key);
      const tdSalary = createMyElement('td', 'salary editable', `$${salary}`);
      tdSalary.setAttribute('data-key', key);
      const tdPayment = createMyElement('td', '', `$${payment}`);
      const tdAssignments = createMyElement('td', 'project');

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
        showAssignments.addEventListener('mouseover', (e) =>
          createTooltip({
            targetElement: e.target,
            tooltipClass: 'tooltip',
            tooltipStringContent: assignmentDetails,
            tooltipHtmlContent: '',
            position: 'center'
          }));
        showAssignments.addEventListener('mouseout', removeTooltip);
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
      trs.push(tr);
    }
    
  } else {
    const trNoData = noData(9);
    trs.push(trNoData);
  }
  
  return trs;
}