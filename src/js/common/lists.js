import { createMyElement } from "./functions";

export const links = [
  {
    title: 'Projects',
    id: 0,
    default: true,
    buttons: {
      addProject: function () {
        let button;
        if (!document.querySelector('.header').hasChildNodes()) {
          button = createMyElement('button', 'btn add-project', '+Add project');
        }
        return button;
      },
      seedData: function () {
        let button;
        if (!document.querySelector('.header').hasChildNodes()) {
          button = createMyElement('button', 'btn seed-data', 'Seed data');
        }
        return button;
      },
    }
  },
  {
    title: 'Employees',
    id: 1,
    default: false,
    buttons: {
      addEmployee: function () {
        let button;
        if (!document.querySelector('.header').hasChildNodes()) {
          button = createMyElement('button', 'btn add-employee', '+Add employee');
        }
        return button;
      }
    }
  },
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const years = [
  2025,
  2026,
  2027
];

export const formProject = {
  projectName: {
    label: createMyElement('label'),
    labelText: 'Project Name: *',
    input: createMyElement('input'),
    type: 'text',
    name: 'project-name',
    title: 'Project name must be at least 3 characters',
    reqired: true,
    minlength: 3,
    pattern: '[A-Za-z0-9\s]+',
  },
  companyName: {
    label: createMyElement('label'),
    labelText: 'Company Name: *',
    input: createMyElement('input'),
    type: 'text',
    name: 'company-name',
    title: 'Company name must be at least 2 characters',
    reqired: true,
    minlength: 2,
    pattern: '[A-Za-z0-9\s]+',
  },
  budget: {
    label: createMyElement('label'),
    labelText: 'Budget: *',
    input: createMyElement('input'),
    type: 'number',
    name: 'project-budget',
    title: 'Budget must be greater than 0',
    reqired: true,
    min: '0.01',
    step: '0.01',
  },
  budget: {
    label: createMyElement('label'),
    labelText: 'Employee Capacity: *',
    input: createMyElement('input'),
    type: 'number',
    name: 'employee-capacity',
    title: 'Employee capacity must be at least 1',
    reqired: true,
    min: '1',
    step: '1',
  },
  formButtons: {
    addButton: {
      button: createMyElement('button', '', 'Add'),
      type: 'submit',
      disabled: true,
    },
    canselButton: {
      button: createMyElement('button', '', 'Cansel'),
      type: 'button',
      disabled: false,
    },
  }
};

export const formEmployee = {

};