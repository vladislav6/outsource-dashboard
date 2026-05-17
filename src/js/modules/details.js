import { createModal, createMyElement, noData, getNumber, getEmployeeAssignmentsCountCapacity, getWorkDaysInMonth, getEmployeeCurrentCapacity } from "../common/functions";
import { editAssign } from "./edit-assign";

export function getDetailsTable(details) {
  let profitSum = 0;
  const table = createMyElement('table', 'table');
  const tr = createMyElement('tr');
  
  const th = createMyElement('th', '', `${details.thTitle}`);
  const thCapacity = createMyElement('th', '', 'Capacity');
  const thFit = createMyElement('th', '', 'Fit');
  const thVacation = createMyElement('th', '', 'Vacation');
  const thEffective = createMyElement('th', '', 'Effective');
  const thRevenue = createMyElement('th', '', 'Revenue');
  const thCost = createMyElement('th', '', 'Cost');
  const thProfit = createMyElement('th', '', 'Profit');
  const thActions = createMyElement('th', '', 'Actions');

  tr.append(th, thCapacity, thFit, thVacation, thEffective, thRevenue, thCost, thProfit, thActions);
  table.append(tr);

  if (details.assign && details.assign.length !== 0) {

    const projectDetails = {};
    const employeeDetails = {};
    const effectiveCapacity = [];

    details.projects.forEach((project) =>
      projectDetails[project.id] = {
        'project': project.project,
        'budget': project.budget,
        'capacity': project.capacity
      }
    );

    details.employees.forEach((employee, index) =>
      employeeDetails[employee.id] = {
        'id': employee.id,
        'name': employee.name,
        'surname': employee.surname,
        'salary': employee.salary,
        'vacation': employee.vacationDays,
        'key': index,
        'assignments': employee.assignments 
      }
    );

    for (let key in details.assign) {
      const {
        projectId,
        employeeId,
        capacity,
        fit
      } = details.assign[key];

      if (employeeDetails.hasOwnProperty(employeeId)){
        const title = details.thTitle === 'Employee'
            ? `${employeeDetails[employeeId].name} ${employeeDetails[employeeId].surname}`
            : projectDetails[projectId].project;

        const workingDays = getWorkDaysInMonth(details.year, details.month);
        const vacationWorkingDays = employeeDetails[employeeId].vacation.length;
        const vacationCoefficient = (workingDays - vacationWorkingDays) / workingDays;
        
        const currentCapacityProject = getEmployeeAssignmentsCountCapacity(details.employees)[projectId] ?
          getEmployeeAssignmentsCountCapacity(details.employees)[projectId] : 0;
        

        effectiveCapacity.push(getNumber(capacity * fit * vacationCoefficient));
        const usedEffectiveCapacity = getNumber(effectiveCapacity.reduce((acc, capacity) => acc += capacity));

        const capacityForRevenue = Math.max(currentCapacityProject, usedEffectiveCapacity);
        const revenuePerEffectiveCapacity = getNumber(getNumber(projectDetails[projectId].budget) / capacityForRevenue);
        const employeeRevenue = getNumber(revenuePerEffectiveCapacity * effectiveCapacity[key]);

        const payment = getNumber(employeeDetails[employeeId].salary * Math.max(0.5, capacity));
        const profit = employeeRevenue - payment;
        profitSum += profit;
        const incomeClass = profit >= 0 ? 'profit' : 'loss';
        
        const tr = createMyElement('tr');

        const tdName = createMyElement('td', '', title);
        const tdCapacity = createMyElement('td', '', `${capacity}`);
        const tdFit = createMyElement('td', '', `${fit}`);
        const tdVacation = createMyElement('td', '', `${vacationWorkingDays !== 0 ? `${vacationWorkingDays} days` : '-'}`);
        const tdEffective = createMyElement('td', '', `${effectiveCapacity[key].toFixed(3)}`);
        const tdRevenue = createMyElement('td', '', `$${employeeRevenue.toFixed(2)}`);
        const tdCost = createMyElement('td', '', `$${payment.toFixed(2)}`);
        const tdProfit = createMyElement('td', `income income-details ${incomeClass}`, `$${profit.toFixed(2)}`);
        const tdActions = createMyElement('td');

        const editBtn = createMyElement('button', 'btn assign-edit', 'Edit');

        const unassignBtn = createMyElement('button', 'btn assign-del', 'Unassign');

        const aboutPopup = {
          isProject: details.thTitle === 'Employee',
          name: title,
          projectId,
          key: employeeDetails[employeeId].key,
          project:
          details.thTitle === 'Employee'
            ? projectDetails[projectId].project
            : `${employeeDetails[employeeId].name} ${employeeDetails[employeeId].surname}`,
          capacity,
          fit,
          effectiveCapacity: currentCapacityProject,
          projectCapacity: projectDetails[projectId].capacity,
          employeeCapacity: getEmployeeCurrentCapacity(employeeDetails[employeeId].assignments),
          year: details.year,
          month: details.month
        };

        editBtn.addEventListener('click', () => {
          if (document.querySelector('.popup')) {
            document.body.removeChild(document.querySelector('.popup'));
            editAssign(editBtn.getBoundingClientRect(), aboutPopup);
          } else {
            editAssign(editBtn.getBoundingClientRect(), aboutPopup);
          }
        });


        tdActions.append(editBtn, unassignBtn);
        tr.append(tdName, tdCapacity, tdFit, tdVacation, tdEffective, tdRevenue, tdCost, tdProfit, tdActions);
        table.append(tr);
      }
    }
  } else {
    const trNoData = noData(9, 'No assignments for this employee.');
    table.append(trNoData);
  }

  const overlay = createModal({
    title: details.modalTitle,
    text: '',
    item: '',
    content: table
  });

  overlay.addEventListener('click', (e) => {
    if (
      document.querySelector('.popup') &&
      !document.querySelector('.popup').contains(e.target) &&
      !e.target.classList.contains('assign-edit')
    ) {
      document.body.removeChild(document.querySelector('.popup'));
    } 
  });

  return {
    overlay,
    profit: profitSum
  }
}