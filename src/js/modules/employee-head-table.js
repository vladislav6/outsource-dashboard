import { createMyElement } from "../common/functions";

export function employeeHeadTable() {
   const tr = createMyElement('tr');
  
  const thName = createMyElement('th', '', 'Name');
  const iconWrapName = createMyElement('div', 'icon-wrapper');
  const iconFilterableName = createMyElement('span', 'filterable');
  iconFilterableName.setAttribute('data-filter', 'name');
  iconFilterableName.setAttribute('data-filter-label', 'Name: ');
  const iconSortableName = createMyElement('span', 'sortable');
  iconSortableName.setAttribute('data-column', 'name');
  iconWrapName.append(iconFilterableName, iconSortableName);
  thName.append(iconWrapName);

  const thSurname = createMyElement('th', '', 'Surname');
  const iconWrapSurname = createMyElement('div', 'icon-wrapper');
  const iconFilterableSurname = createMyElement('span', 'filterable');
  iconFilterableSurname.setAttribute('data-filter', 'surname');
  iconFilterableSurname.setAttribute('data-filter-label', 'Surname: ');
  const iconSortableSurname = createMyElement('span', 'sortable');
  iconSortableSurname.setAttribute('data-column', 'surname');
  iconWrapSurname.append(iconFilterableSurname, iconSortableSurname);
  thSurname.append(iconWrapSurname);

  const thAge = createMyElement('th', '', 'Age');
  const iconWrapAge = createMyElement('div', 'icon-wrapper');
  const iconSortableAge = createMyElement('span', 'sortable');
  iconSortableAge.setAttribute('data-column', 'dob');
  iconWrapAge.append(iconSortableAge);
  thAge.append(iconWrapAge);

  const thPosition = createMyElement('th', '', 'Position');
  const iconWrapPosition = createMyElement('div', 'icon-wrapper');
  const iconFilterablePosition = createMyElement('span', 'filterable');
  iconFilterablePosition.setAttribute('data-filter', 'position');
  iconFilterablePosition.setAttribute('data-filter-label', 'Position: ');
  const iconSortablePosition = createMyElement('span', 'sortable');
  iconSortablePosition.setAttribute('data-column', 'position');
  iconWrapPosition.append(iconFilterablePosition, iconSortablePosition);
  thPosition.append(iconWrapPosition);

  const thSalary = createMyElement('th', '', 'Salary');
  const iconWrapSalary = createMyElement('div', 'icon-wrapper');
  const iconSortableSalary = createMyElement('span', 'sortable');
  iconSortableSalary.setAttribute('data-column', 'salary');
  iconWrapSalary.append(iconSortableSalary);
  thSalary.append(iconWrapSalary);

  const thEstimatedPayment = createMyElement('th', '', 'Estimated Payment');
  const thProject = createMyElement('th', '', 'Project');
  const thProjectedIncome = createMyElement('th', '', 'Projected Income');
  const thActions = createMyElement('th', '', 'Actions');

  tr.append(thName, thSurname, thAge, thPosition, thSalary, thEstimatedPayment, thProject, thProjectedIncome, thActions);

  return tr;
}