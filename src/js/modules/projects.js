import { createMyElement } from "../common/functions";

export function projectTable() {
  const table = createMyElement('table', 'table');
  const tr = createMyElement('tr');
  
  const thNameCompany = createMyElement('th', 'sortable filterable', 'Company name');
  const thNameProject = createMyElement('th', 'sortable filterable', 'Project name');
  const thBudget = createMyElement('th', 'sortable', 'Budget');
  const thEmployeeCapacity = createMyElement('th', 'sortable', 'Employee Capacity');
  const thEmployees = createMyElement('th', '', 'Employees');
  const thEstimatedIncome = createMyElement('th', 'sortable', 'Estimated Income');
  const thActions = createMyElement('th', '', 'Actions');

  tr.append(thNameCompany, thNameProject, thBudget, thEmployeeCapacity, thEmployees, thEstimatedIncome, thActions);

  table.append(tr);

  return table;
}