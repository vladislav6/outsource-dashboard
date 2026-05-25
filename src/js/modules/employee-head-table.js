import { createMyElement } from "../common/functions";

export function employeeHeadTable() {
   const tr = createMyElement('tr');
  
  const thName = createMyElement('th', '', 'Name');
  const iconWrapName = createMyElement('div', 'icon-wrapper');
  const iconFilterableName = createMyElement('span', 'filterable');
  iconFilterableName.setAttribute('data-filter', 'name');
  const iconSortableName = createMyElement('span', 'sortable');
  iconWrapName.append(iconFilterableName, iconSortableName);
  thName.append(iconWrapName);

  const thSurname = createMyElement('th', '', 'Surname');
  const iconWrapSurname = createMyElement('div', 'icon-wrapper');
  const iconFilterableSurname = createMyElement('span', 'filterable');
  iconFilterableSurname.setAttribute('data-filter', 'surname');
  const iconSortableSurname = createMyElement('span', 'sortable');
  iconWrapSurname.append(iconFilterableSurname, iconSortableSurname);
  thSurname.append(iconWrapSurname);

  const thAge = createMyElement('th', '', 'Age');
  const iconWrapAge = createMyElement('div', 'icon-wrapper');
  const iconSortableAge = createMyElement('span', 'sortable');
  iconWrapAge.append(iconSortableAge);
  thAge.append(iconWrapAge);

  const thPosition = createMyElement('th', '', 'Position');
  const iconWrapPosition = createMyElement('div', 'icon-wrapper');
  const iconFilterablePosition = createMyElement('span', 'filterable');
  iconFilterablePosition.setAttribute('data-filter', 'position');
  const iconSortablePosition = createMyElement('span', 'sortable');
  iconWrapPosition.append(iconFilterablePosition, iconSortablePosition);
  thPosition.append(iconWrapPosition);

  const thSalary = createMyElement('th', '', 'Salary');
  const iconWrapSalary = createMyElement('div', 'icon-wrapper');
  const iconSortableSalary = createMyElement('span', 'sortable');
  iconWrapSalary.append(iconSortableSalary);
  thSalary.append(iconWrapSalary);

  const thEstimatedPayment = createMyElement('th', '', 'Estimated Payment');
  const iconWrapPayment = createMyElement('div', 'icon-wrapper');
  const iconSortablePayment = createMyElement('span', 'sortable');
  iconWrapPayment.append(iconSortablePayment);
  thEstimatedPayment.append(iconWrapPayment);

  const thProject = createMyElement('th', '', 'Project');
  const iconWrapProject = createMyElement('div', 'icon-wrapper');
  const iconFilterableProject = createMyElement('span', 'filterable');
  iconFilterableProject.setAttribute('data-filter', 'project');
  const iconSortableProject = createMyElement('span', 'sortable');
  iconWrapProject.append(iconFilterableProject, iconSortableProject);
  thProject.append(iconWrapProject);

  const thProjectedIncome = createMyElement('th', '', 'Projected Income');
  const iconWrapIncome = createMyElement('div', 'icon-wrapper');
  const iconSortableIncome = createMyElement('span', 'sortable');
  iconWrapIncome.append(iconSortableIncome);
  thProjectedIncome.append(iconWrapIncome);

  const thActions = createMyElement('th', '', 'Actions');

  tr.append(thName, thSurname, thAge, thPosition, thSalary, thEstimatedPayment, thProject, thProjectedIncome, thActions);

  return tr;
}