export const links = [
  {
    title: 'Projects',
    id: 0,
    default: true,
    buttons: {
      addProject: function() {
        const btn = document.createElement('button');
        btn.textContent = '+Add project';
        btn.classList = 'btn add-project';

        return btn;
      },
      seedData: function() {
        const btn = document.createElement('button');
        btn.textContent = 'Seed data';
        btn.classList = 'btn seed-data';

        return btn;
      },
    }
  },
  {
    title: 'Employees',
    id: 1,
    default: false,
    buttons: {
      addEmployees: function() {
        const btn = document.createElement('button');
        btn.textContent = '+Add employee';
        btn.classList = 'btn add-employee';

        return btn;
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