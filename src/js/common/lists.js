import { createMyElement } from "./functions";

export const links = [
  {
    title: 'Projects',
    id: 0,
    default: true,
    buttons: {
      addProject: function() {
        return createMyElement('button', 'btn add-project', '+Add project');
      },
      seedData: function() {
        return createMyElement('button', 'btn seed-data', 'Seed data');
      },
    }
  },
  {
    title: 'Employees',
    id: 1,
    default: false,
    buttons: {
      addEmployee: function() {
        return createMyElement('button', 'btn add-employee', '+Add employee');
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