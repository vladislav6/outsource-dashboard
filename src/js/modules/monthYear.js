const months = [
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

const years = [
  2025,
  2026,
  2027
];

function addSelectMonthOptions (options) {
  const selectMonths = document.querySelector('.months');
  const currentMonth = new Date().getMonth();

  options.forEach((month, index) => {
    const monthOption = document.createElement('option');
    if (index === currentMonth) {
      monthOption.selected = true;
    }
    monthOption.value = index;
    monthOption.textContent = month;
    selectMonths.append(monthOption);
  });
}

function addSelectYearOptions (options) {
  const selectYears = document.querySelector('.years');
  const currentYear = new Date().getFullYear();

  options.forEach((year) => {
    const yearOption = document.createElement('option');
    if (year === currentYear) {
      yearOption.selected = true;
    }
    yearOption.value = year;
    yearOption.textContent = year;
    selectYears.append(yearOption);
  });
}

addSelectMonthOptions(months);
addSelectYearOptions(years);