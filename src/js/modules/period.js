import { months, years } from '../common/lists';
import { createMyElement } from '../common/functions';

const period = document.querySelector('.period');

function addSelectMonthOptions (options) {
  const selectMonths = document.querySelector('.months');
  const currentMonth = new Date().getMonth();

  options.forEach((month, index) => {
    const monthOption = createMyElement('option', '', month);
    if (index === currentMonth) {
      monthOption.selected = true;
    }
    monthOption.value = index;

    selectMonths.append(monthOption);
  });
}

function addSelectYearOptions (options) {
  const selectYears = document.querySelector('.years');
  const currentYear = new Date().getFullYear();

  options.forEach((year) => {
    const yearOption = createMyElement('option', '', year);
    if (year === currentYear) {
      yearOption.selected = true;
    }
    yearOption.value = year;
    
    selectYears.append(yearOption);
  });
}

addSelectMonthOptions(months);
addSelectYearOptions(years);