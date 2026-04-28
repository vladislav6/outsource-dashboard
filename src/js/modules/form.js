import { createMyElement, clearDOM } from "../common/functions";

function closeAside(aside, form) {
  aside.classList.remove('show');
  getValues(form).inputs.map((input) => {
    input.value = '';
    input.classList.remove('valid');
    input.classList.remove('invalid');
    if (input.nextElementSibling) {
      input.nextElementSibling.remove();
    }
  });
  clearDOM(aside);
}

function getValues(form) {
  const getAllInput = [
    ...form.getElementsByTagName('input'),
    ...form.getElementsByTagName('select')
  ];
  const addButton = form.querySelector('.addButton');

  const allValue = getAllInput.map((input) => input.value.trim());
  const allTitle = getAllInput.map((input) => input.title);
  const inputs = getAllInput.map((input) => input);

  return {
    allValue: allValue,
    allTitle: allTitle,
    inputs: inputs,
    button: addButton
  };
}

function setInvalid(element, title) {
  if (!element.nextElementSibling) {
    const error = createMyElement('span', 'error-message', title);
    element.classList.remove('valid');
    element.classList.add('invalid');
    element.after(error);
  }
  return false;
}

function setValid(element) {
  element.classList.remove('invalid');
  element.classList.add('valid');
  if (element.nextElementSibling) {
    element.nextElementSibling.remove();
  }
  return true;
}

function birthdayValid(birthdayValue) {
  let result = false;
  if (birthdayValue && `${new Date(birthdayValue).getFullYear()}`.length === 4 ) {
    if (new Date().getFullYear() - new Date(birthdayValue).getFullYear() === 18) {
      if (new Date().getMonth() === new Date(birthdayValue).getMonth()) {
        if (new Date().getDate() >= new Date(birthdayValue).getDate()) {
          result = true;
        } else {
          result = false;
        }
      
      } else if (new Date().getMonth() > new Date(birthdayValue).getMonth()) {
        result = true;
      } else {
        result = false;
      }

    } else if (new Date().getFullYear() - new Date(birthdayValue).getFullYear() > 18) {
      result = true;
    }
  }

  return result;
}

function validateProjectForm(form) {
  const [
    projectName,
    companyName,
    budget,
    employeeCapacity
   ] = form.inputs;

  const [
    projectNameValue,
    companyNameValue,
    budgetValue,
    employeeCapacityValue
   ] = form.allValue;

  const [
    projectNameTitle,
    companyNameTitle,
    budgetTitle,
    employeeCapacityTitle
    ]  = form.allTitle;

  const isValidProjectName = projectNameValue.length < 3 ?
    setInvalid(projectName, projectNameTitle) : setValid(projectName);

  const isValidCompanyName = companyNameValue.length < 2 ?
    setInvalid(companyName, companyNameTitle) : setValid(companyName);

  const isValidBudget = budgetValue <= 0 &&
    typeof budgetValue !== 'number' ?
    setInvalid(budget, budgetTitle) : setValid(budget);
    
  const isValidEmployeeCapacity = employeeCapacityValue < 1 &&
    typeof employeeCapacityValue !== 'number' ?
    setInvalid(employeeCapacity, employeeCapacityTitle) : setValid(employeeCapacity);

  const isValid = [
    isValidProjectName,
    isValidCompanyName,
    isValidBudget,
    isValidEmployeeCapacity
  ].every((value) => value === true);

  if (isValid) {
    form.button.disabled = false;
    form.button.classList.remove('disable');
  } else {
    form.button.disabled = true;
    form.button.classList.add('disable');
  }
}

function validateEmployeeForm(form) {

  const [
    employeeName,
    employeeSurname,
    birthday,
    salary,
    position
  ] = form.inputs;

   const [
    employeeNameValue,
    employeeSurnameValue,
    birthdayValue,
    salaryValue,
    positionValue
  ] = form.allValue;

  const [
    employeeNameTitle,
    employeeSurnameTitle,
    birthdayTitle,
    salaryTitle,
    positionTitle
  ] = form.allTitle;

  console.log();

  const isValidEmployeeName = employeeNameValue.length < 3 ?
    setInvalid(employeeName, employeeNameTitle) : setValid(employeeName);
  const isValidEmployeeSurname = employeeSurnameValue.length < 3 ?
    setInvalid(employeeSurname, employeeSurnameTitle) : setValid(employeeSurname);
  const isValidBirthday = !birthdayValid(birthdayValue) ?
    setInvalid(birthday, birthdayTitle) : setValid(birthday);
  const isValidSalary = salaryValue <= 0 &&
    typeof salaryValue !== 'number' ?
    setInvalid(salary, salaryTitle) : setValid(salary);
  const isValidPosition = positionValue === '' ?
    setInvalid(position, positionTitle) : setValid(position);
  
  const isValid = [
    isValidEmployeeName,
    isValidEmployeeSurname,
    isValidBirthday,
    isValidSalary,
    isValidPosition
  ].every((value) => value === true);

  if (isValid) {
    form.button.disabled = false;
    form.button.classList.remove('disable');
  } else {
    form.button.disabled = true;
    form.button.classList.add('disable');
  }
}


export function createForm(aboutForm, classForm, asidePanelElement) {
  const form = createMyElement('form', `form ${classForm}`);
  const btnBlock = createMyElement('div', 'buttons');

  for (let key in aboutForm) {
    const {
      label,
      input,
      type,
      name,
      title,
      required,
      ...other
    } = aboutForm[key];
    
    if (
      key !== 'position' &&
      key !== 'addButton' &&
      key !== 'canselButton'
    ) {
      input.type = type;
      input.name = name;
      input.title = title;
      input.required = required;
      
      if (other.minlength) {
        input.minLength = other.minlength;
        input.pattern = other.pattern;
      } else {
        input.min = other.min;
        input.step = other.step;
      }

      label.append(input)
      form.append(label);

    } else if (key === 'position') {
      
      const {
        label,
        input,
        name,
        title,
        required,
        options: {
          defaultOption,
          junior,
          middle,
          senior,
          lead,
          architect,
          BO,
        }
      } = aboutForm[key];
      
      input.name = name;
      input.title = title;
      input.required = required;

      defaultOption.selected = true;
      defaultOption.value = '';
      junior.value = 'junior';
      middle.value = 'middle';
      senior.value = 'senior';
      lead.value = 'lead';
      architect.value = 'architect';
      BO.value = 'BO';

      input.append(
        junior,
        middle,
        senior,
        lead,
        architect,
        BO
      );
      input.prepend(defaultOption);
      label.append(input);
      form.append(label);

    } else {

      const {
        button,
        type,
        disabled
      } = aboutForm[key];

      button.type = type;
      button.disabled = disabled;
      btnBlock.append(button);
    }
  }
  
  form.append(btnBlock);

  form.addEventListener('input', () => {
    
    const allValuesFormForValidate = getValues(form);

    form.classList[1] === 'project-form' ?
      validateProjectForm(allValuesFormForValidate) :
      validateEmployeeForm(allValuesFormForValidate);
  });

  form.addEventListener('click', (e) => {
    const allValues = getValues(form).allValue;
    if (e.target.type === 'submit') {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        closeAside(asidePanelElement, form);
      });
    }
    
    if (e.target.type === 'button') {
      closeAside(asidePanelElement, form);
    }
  });

  return form;
}