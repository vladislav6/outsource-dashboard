import { createModal, createMyElement, getNumber, getAllAssignments } from "../common/functions";
import { getContent } from "./content";
import { getDetailsTable } from "./details";

export function unassign(details) {
  const {
    modalTitle,
    thTitle,
    name,
    employeeId,
    projectId,
    employeeCapacity,
    project,
    cost,
    revenue,
    profit,
    projectBudjet,
    projectCapacity,
    projectCapacityDefault,
    year,
    month
  } = details;

  const financialDetails = createMyElement('div', 'unassign-info');

  const assignedCapacity = createMyElement('div', 'financ-detail', 'Assigned Capacity:');
  const assignedCapacityValue = createMyElement('span', '', employeeCapacity);
  assignedCapacity.append(assignedCapacityValue);

  const employeeSalaryShare = createMyElement('div', 'financ-detail', 'Employee Salary Share:');
  const employeeSalaryShareValue = createMyElement('span', '', `$${cost}`);
  employeeSalaryShare.append(employeeSalaryShareValue);

  const budgetShare = createMyElement('div', 'financ-detail', 'Budget Share:');
  const budgetShareValue = createMyElement('span', '', `$${revenue}`);
  budgetShare.append(budgetShareValue);

  const incomeClassEEI = profit >= 0 ? 'profit' : 'loss';
  const employeeEstIncome = createMyElement('div', 'financ-detail', 'Employee Estimated Income:');
  const employeeEstIncomeValue = createMyElement('span', `income ${incomeClassEEI}`, `$${getNumber(profit)}`);
  employeeEstIncome.append(employeeEstIncomeValue);

  const currentProjectCapacity = createMyElement('div', 'financ-detail', 'Current Project Capacity:');
  const currentProjectCapacityValue =
    createMyElement('span', '', `${getNumber(projectCapacity)} / ${projectCapacityDefault}`);
  currentProjectCapacity.append(currentProjectCapacityValue);

  const capacityAfterUnassignment = createMyElement('div', 'financ-detail', 'Capacity After Unassignment:');
  const capacityAfterUnassignmentValue = createMyElement(
    'span',
    '',
    `${getNumber(projectCapacity - employeeCapacity)} / ${projectCapacityDefault}`);
  capacityAfterUnassignment.append(capacityAfterUnassignmentValue);
  
  const PIN = getNumber(projectBudjet - cost);
  const incomeClassPIN = PIN >= 0 ? 'profit' : 'loss';
  const projectIncomeNow = createMyElement('div', 'financ-detail', 'Project Income Now:');
  const projectIncomeNowValue = createMyElement('span', `income ${incomeClassPIN}`, `$${PIN}`);
  projectIncomeNow.append(projectIncomeNowValue);

  const PIA = getNumber(PIN + cost);
  const incomeClassPIA = PIA >= 0 ? 'profit' : 'loss';
  const projectIncomeAfter = createMyElement('div', 'financ-detail', 'Project Income After:');
  const projectIncomeAfterValue = createMyElement('span', `income ${incomeClassPIA}`, `$${PIA}`);
  projectIncomeAfter.append(projectIncomeAfterValue);

  const unassignBtn = createMyElement('button', 'btn assign-btn', 'Unassign');
  const unassignCnl = createMyElement('button', 'btn assign-cnl', 'Cancel');
  const btnBlock = createMyElement('div', 'assign-btn-block');
  btnBlock.append(unassignBtn, unassignCnl);

  unassignBtn.addEventListener('click', () => {
    if (localStorage.getItem('monthlyData')) {
      const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
      monthlyData[`${year}-${month}`].employees.forEach((employee) => {
        if (employee.id === details.employeeId) {
          const assings = employee.assignments.filter((assign) => assign.projectId !== projectId);
          employee.assignments = assings;
          localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
          [...document.querySelectorAll('.overlay')].forEach((element) => document.body.removeChild(element));
          getContent(Number(document.querySelector('.active').getAttribute('data-id')));
          const assignments = thTitle === 'Employee'
            ? getAllAssignments(monthlyData[`${year}-${month}`].employees).filter((f) => f.projectId === projectId)
            : assings;
          const overlay = getDetailsTable({
            modalTitle,
            thTitle,
            assign: assignments,
            projects: monthlyData[`${year}-${month}`].projects,
            employees: monthlyData[`${year}-${month}`].employees,
            year,
            month
          });
          document.body.append(overlay.overlay);
        }
      });
    }
  });

  unassignCnl.addEventListener('click', () => document.body.removeChild(overlay));

  financialDetails.append(assignedCapacity, employeeSalaryShare, budgetShare, employeeEstIncome, currentProjectCapacity, capacityAfterUnassignment, projectIncomeNow, projectIncomeAfter, btnBlock);

  const overlay = createModal({
    title: 'Unassign Confirmation',
    text: `You want to unassign ${name} (${employeeCapacity} capacity) from ${project}?`,
    item: 'unassign',
    content: financialDetails
  });

  document.body.append(overlay);
}