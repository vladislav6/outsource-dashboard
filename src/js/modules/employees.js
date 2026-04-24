import { createMyElement } from "../common/functions";

export function employeeTable() {
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

  return table;
}