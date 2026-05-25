import { createMyElement } from "../common/functions";

export function projectHeadTable() {
  const tr = createMyElement('tr');
  
  const thNameCompany = createMyElement('th', '', 'Company name');
  const iconWrapCompany = createMyElement('div', 'icon-wrapper');
  const iconFilterableCompany = createMyElement('span', 'filterable');
  const iconSortableCompany = createMyElement('span', 'sortable');
  iconWrapCompany.append(iconFilterableCompany, iconSortableCompany);
  thNameCompany.append(iconWrapCompany);

  const thNameProject = createMyElement('th', '', 'Project name');
  const iconWrapProject = createMyElement('div', 'icon-wrapper');
  const iconFilterableProject = createMyElement('span', 'filterable');
  const iconSortableProject = createMyElement('span', 'sortable');
  iconWrapProject.append(iconFilterableProject, iconSortableProject);
  thNameProject.append(iconWrapProject);

  const thBudget = createMyElement('th', '', 'Budget');
  const iconWrapBudget = createMyElement('div', 'icon-wrapper');
  const iconSortableBudget = createMyElement('span', 'sortable');
  iconWrapBudget.append(iconSortableBudget);
  thBudget.append(iconWrapBudget);

  const thEmployeeCapacity = createMyElement('th', '', 'Employee Capacity');
  const iconWrapCapacity = createMyElement('div', 'icon-wrapper');
  const iconSortableCapacity = createMyElement('span', 'sortable');
  iconWrapCapacity.append(iconSortableCapacity);
  thEmployeeCapacity.append(iconWrapCapacity);

  const thEmployees = createMyElement('th', '', 'Employees');

  const thEstimatedIncome = createMyElement('th', '', 'Estimated Income');
  const iconWrapIncome = createMyElement('div', 'icon-wrapper');
  const iconSortableIncome = createMyElement('span', 'sortable');
  iconWrapIncome.append(iconSortableIncome);
  thEstimatedIncome.append(iconWrapIncome);

  const thActions = createMyElement('th', '', 'Action');

  tr.append(thNameCompany, thNameProject, thBudget, thEmployeeCapacity, thEmployees, thEstimatedIncome, thActions);

  return tr;
}