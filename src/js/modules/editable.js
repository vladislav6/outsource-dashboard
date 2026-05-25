import { createMyElement, cancelEdit } from "../common/functions";
import { getContent } from "./content";

function changePosition(data) {
  const {
    monthlyData,
    year,
    month,
    td,
    key
  } = data;

  const select = createMyElement('select', 'select-position');

  const defaultOption = createMyElement('option', '', 'Select');
  const junior = createMyElement('option', '', 'Junior');
  const middle = createMyElement('option', '', 'Middle');
  const senior = createMyElement('option', '', 'Senior');
  const lead = createMyElement('option', '', 'Lead');
  const architect = createMyElement('option', '', 'Architect');
  const bo = createMyElement('option', '', 'BO');

  select.append(defaultOption, junior, middle, senior, lead, architect, bo);
  td.append(select);
  
  select.addEventListener('change', () => {
    monthlyData[`${year}-${month}`].employees[key].position = select.value;
    localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
    getContent(1);
  });
}

function changeSalary(data) {
  const {
    monthlyData,
    year,
    month,
    td,
    key
  } = data;

  const input = createMyElement('input', 'input-salary');
  input.type = 'number';
  input.value = Number(td.textContent.slice(1));

  td.append(input);

  let currentSalary = input.value;

  const onChangeSalary = () => {
    if (currentSalary !== input.value && Number(input.value) > 0) {
      monthlyData[`${year}-${month}`].employees[key].salary = input.value;
      localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
      getContent(1);
      input.value = 0;
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      onChangeSalary();
    }
  });

  document.addEventListener('click', (e) => {
      onChangeSalary();
  });
}

export function editableTool(aboutEdit) {
  const {
    target,
    monthlyData,
    year,
    month,
  } = aboutEdit;

  const key = target.getAttribute('data-key');
  if (target.classList.contains('position')) {
    cancelEdit('.select-position');
    changePosition({
      monthlyData,
      year,
      month,
      td: target,
      key
    });
  }

  if (target.classList.contains('salary')) {
    cancelEdit('.input-salary');
    changeSalary({
      monthlyData,
      year,
      month,
      td: target,
      key
    });
  }
  target.classList.remove('editable');
}