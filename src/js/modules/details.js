import { createModal, createMyElement, noData, getNumber, getEmployeeAssignmentsCountCapacity } from "../common/functions";

export function getDetailsTable(details) {
  const getProfit = {
  'profit': 0
  };

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
    const workingDays = 20;
    const vacationWorkingDays = details.vacation.length;
    const vacationCoefficient = (workingDays - vacationWorkingDays) / workingDays;

    const projectDetails = [];
    const effectiveCapacity = [];

    for (let key in details.assign) {
      const {
        projectId,
        capacity,
        fit
      } = details.assign[key];
      
      const currentCapacityProject = getEmployeeAssignmentsCountCapacity(details.employees)[projectId] ?
        getEmployeeAssignmentsCountCapacity(details.employees)[projectId] : 0;

      const projects = details.projects.filter((project) => project.id === projectId);
      projects.forEach((project) => projectDetails.push({ 'name': project.project, 'budget': project.budget }));

      effectiveCapacity.push(getNumber(capacity * fit * vacationCoefficient));
      const usedEffectiveCapacity = getNumber(effectiveCapacity.reduce((acc, capacity) => acc += capacity));

      const capacityForRevenue = Math.max(currentCapacityProject, usedEffectiveCapacity);
      const revenuePerEffectiveCapacity = getNumber(getNumber(projectDetails[key].budget) / capacityForRevenue);
      const employeeRevenue = getNumber(revenuePerEffectiveCapacity * effectiveCapacity[key]);

      const payment = getNumber(details.salary * Math.max(0.5, capacity));
      const profit = employeeRevenue - payment;
      getProfit['profit'] += profit;
      const incomeClass = profit >= 0 ? 'profit' : 'loss';
      
      const tr = createMyElement('tr');

      const tdName = createMyElement('td', '', `${projectDetails[key].name}`);
      const tdCapacity = createMyElement('td', '', `${capacity}`);
      const tdFit = createMyElement('td', '', `${fit}`);
      const tdVacation = createMyElement('td', '', `${vacationWorkingDays !== 0 ? `${vacationWorkingDays} days` : '-'}`);
      const tdEffective = createMyElement('td', '', `${effectiveCapacity[key].toFixed(3)}`);
      const tdRevenue = createMyElement('td', '', `$${employeeRevenue.toFixed(2)}`);
      const tdCost = createMyElement('td', '', `$${payment.toFixed(2)}`);
      const tdProfit = createMyElement('td', `income ${incomeClass}`, `$${profit.toFixed(2)}`);
      const tdActions = createMyElement('td');

      const editBtn = createMyElement('button', 'btn assing-edit', 'Edit');
      const unassignBtn = createMyElement('button', 'btn assing-del', 'Unassign');

      tdActions.append(editBtn, unassignBtn);
      tr.append(tdName, tdCapacity, tdFit, tdVacation, tdEffective, tdRevenue, tdCost, tdProfit, tdActions);
      table.append(tr);
      
    }
  } else {
    const trNoData = noData(9, 'No assignments for this employee.');
    table.append(trNoData);
  }
  
  const overlay = createModal({
    title: `${details.modalTitle} ${details.name}`,
    text: '',
    item: details.item,
    content: table
  });

  document.body.append(overlay);
  return getProfit;
}