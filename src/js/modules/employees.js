import { createMyElement, noData } from "../common/functions";

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
  const thActions = createMyElement('th', 'actions', 'Actions');

  tr.append(thName, thSurname, thAge, thPosition, thSalary, thEstimatedPayment, thProject, thProjectedIncome, thActions);

  table.append(tr);

  if (localStorage.getItem('monthlyData')) {
    const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
    if (monthlyData.hasOwnProperty(`${year}-${month}`)) {
      if (monthlyData[`${year}-${month}`].employees.length !== 0) {
        for (let key in monthlyData[`${year}-${month}`].employees) {
          const {
            id,
            name,
            surname,
            dob,
            position,
            salary,
            assignments
          } = monthlyData[`${year}-${month}`].employees[key];

          const capacityEmployeeSum = 1.5;
          const capacity = assignments.length === 0 ? 0.5 : capacityEmployeeSum;
          const payment = salary * capacity;
          const assignmentCount = assignments.length;
          const projectedIncome = 0;
          const incomeClass = projectedIncome >= 0 ? 'profit' : 'loss';

          const tr = createMyElement('tr');
          const tdName = createMyElement('td', '', name);
          const tdSurname = createMyElement('td', '', surname);
          const tdAge = createMyElement('td', '', dob);
          const tdPosition = createMyElement('td', '', position);
          const tdSalary = createMyElement('td', '', `$${salary}`);
          const tdPayment = createMyElement('td', '', `$${payment}`);
          const tdAssignments = createMyElement('td');

          const showAssignments = assignmentCount > 0 ?
            createMyElement(
              'button',
              'btn assignments',
              `Show Assignments ${assignmentCount} ${capacityEmployeeSum}/1.5`
            ) : '-';

          const tdIncome = createMyElement('td', `${incomeClass}`, `$${projectedIncome.toFixed(2)}`);
          const tdActions = createMyElement('td');
          const availability = createMyElement('button', 'btn availability', 'Availability');
          const assign = createMyElement('button', 'btn assign', 'Assign');
          const deleteEmployee = createMyElement('button', 'btn delete', 'Delete');

          tdAssignments.append(showAssignments);
          tdActions.append(availability, assign, deleteEmployee);
          tr.append(tdName, tdSurname, tdAge, tdPosition, tdSalary, tdPayment, tdAssignments, tdIncome, tdActions);
          table.append(tr);
        }
      } else {
        const trNoData = noData(9);
        table.append(trNoData);
      }
    }
  }

  return table;
}