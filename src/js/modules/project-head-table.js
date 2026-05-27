import { createMyElement } from "../common/functions";

export function projectHeadTable() {
  const tr = createMyElement('tr');
  
  const thNameCompany = createMyElement('th', '', 'Company name');
  const iconWrapCompany = createMyElement('div', 'icon-wrapper');
  const iconFilterableCompany = createMyElement('span', 'filterable');
  iconFilterableCompany.setAttribute('data-filter', 'company');
  iconFilterableCompany.setAttribute('data-filter-label', 'Company name: ');
  const iconSortableCompany = createMyElement('span', 'sortable');
  iconSortableCompany.setAttribute('data-column', 'company');
  iconWrapCompany.append(iconFilterableCompany, iconSortableCompany);
  thNameCompany.append(iconWrapCompany);

  const thNameProject = createMyElement('th', '', 'Project name');
  const iconWrapProject = createMyElement('div', 'icon-wrapper');
  const iconFilterableProject = createMyElement('span', 'filterable');
  iconFilterableProject.setAttribute('data-filter', 'project');
  iconFilterableProject.setAttribute('data-filter-label', 'Project name: ');
  const iconSortableProject = createMyElement('span', 'sortable');
  iconSortableProject.setAttribute('data-column', 'project');
  iconWrapProject.append(iconFilterableProject, iconSortableProject);
  thNameProject.append(iconWrapProject);

  const thBudget = createMyElement('th', '', 'Budget');
  const iconWrapBudget = createMyElement('div', 'icon-wrapper');
  const iconSortableBudget = createMyElement('span', 'sortable');
  iconSortableBudget.setAttribute('data-column', 'budget');
  iconWrapBudget.append(iconSortableBudget);
  thBudget.append(iconWrapBudget);

  const thEmployeeCapacity = createMyElement('th', '', 'Employee Capacity');
  const iconWrapCapacity = createMyElement('div', 'icon-wrapper');
  const iconSortableCapacity = createMyElement('span', 'sortable');
  iconSortableCapacity.setAttribute('data-column', 'capacity');
  iconWrapCapacity.append(iconSortableCapacity);
  thEmployeeCapacity.append(iconWrapCapacity);

  const thEmployees = createMyElement('th', '', 'Employees');
  const thEstimatedIncome = createMyElement('th', '', 'Estimated Income');
  const thActions = createMyElement('th', '', 'Action');

  tr.append(thNameCompany, thNameProject, thBudget, thEmployeeCapacity, thEmployees, thEstimatedIncome, thActions);

  return tr;
}