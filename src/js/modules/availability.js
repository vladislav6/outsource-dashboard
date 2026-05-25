import { clearDOM, createModal, createMyElement, createConfirm, getWorkDaysInMonth } from "../common/functions";
import { weekDaysName, months } from "../common/lists";
import { getContent } from "./content";

export function makeAvailability(details) {
  const availability = createMyElement('div', 'availability-content');
  const table = createMyElement('table', 'table calendar');
  const trTh = createMyElement('tr');
  const workDays = createMyElement('div', 'work');
  const vacationDays = createMyElement('div', 'vacation');
  const setVacation = createMyElement('button', 'btn set-vacation', 'Set vacation');

  const today = new Date().getDate();
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const currentMonthDays = new Date(details.year, Number(details.month) + 1, 0).getDate();
  const firstDayName = new Date(details.year, details.month, 1).toLocaleString('en', { weekday: 'short' });

  let startCalendarDay = 0;

  weekDaysName.forEach((day, ind) => {
    trTh.append(createMyElement('th', '', day));
    if (firstDayName === day) {
      startCalendarDay = ind;
    }
  });

  table.append(trTh);

  const tdMonthDays = Array.from({ length: 42 }, (_, ind) => {
    if (
      startCalendarDay !== 0 &&
      ind < startCalendarDay ||
      ind > currentMonthDays + startCalendarDay - 1
    ) {
      return createMyElement('td', '', '');
    } else {
      const dayNumber = ind - startCalendarDay + 1;
      const day = createMyElement('td', '', dayNumber);
      if (
        details.vacation &&
        details.vacation.length > 0 &&
        details.vacation.includes(dayNumber)
      ) {
        day.classList.add('vacation');
      }
      return day;
    }
  });

  let tr = createMyElement('tr', 'week');
  if (startCalendarDay !== 0) {
    const emptyTd = createMyElement('td', 'empty-cell');
    emptyTd.colSpan = startCalendarDay;
    tr.append(emptyTd);
  }

  tdMonthDays.forEach((day, ind) => {
    if (
      Number(day.textContent) === today
      && Number(details.year) === year
      && Number(details.month) === month
    ) {
      day.classList.add('today');
    }
    if (ind % 7 === 0 && ind !== 0) {
      tr = createMyElement('tr', 'week');
      tr.append(day);
    } else {
      if (day.textContent !== '') {
        tr.append(day);
      }
    }
    table.append(tr);
  });
  
  vacationDays.append(workDays, setVacation);
  availability.append(table, workDays, vacationDays);

  const overlay = createModal({
    title: `${details.name} - Availability`,
    content: availability,
    text: `${months[details.month]} ${details.year}`,
    item: 'availability'
  });

  document.body.append(overlay);

  const weeks = [...document.querySelectorAll('.week')];
  weeks.forEach((week, ind) => {
    const sunday = [...week.childNodes][0];
    const saturday = [...week.childNodes][week.childNodes.length - 1];
    if (!sunday.classList.contains('empty-cell')) {
      sunday.classList.add('day-off');
    }
    if (week.childNodes.length === 7 || ind === 0) {
      saturday.classList.add('day-off');
    }
  });
  const [ emptyWeek ] = weeks.filter((week) => [...week.childNodes].every((day) => day.textContent === ''));
  if (emptyWeek) {
    table.removeChild(emptyWeek);
  }
  
  overlay.addEventListener('click', (e) => {
    if (e.target.classList.contains('overlay') || e.target.classList.contains('modal-close')) {
      const monthlyData = JSON.parse(localStorage.getItem('monthlyData'));
      const writtenVacationData =
        [...monthlyData[`${details.year}-${details.month}`].employees[details.key].vacationDays].sort((a, b) => a - b);
      const newVacationData = [...details.vacation].sort((a, b) => a - b);
      const areEqual = writtenVacationData.length === newVacationData.length &&
                        writtenVacationData.every((value, index) => value === newVacationData[index]);
      if (!areEqual) {
        document.body.append(createConfirm('Vacation days have been changed. Apply the changes?'));
        if (document.body.querySelector('.confirm')) {
          document.body.querySelector('.confirm').addEventListener('click', () => {
            monthlyData[`${details.year}-${details.month}`].employees[details.key].vacationDays = details.vacation.filter((f) => f !== '');
            localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
            getContent(1);
            [...document.querySelectorAll('.overlay')].forEach((element) => document.body.removeChild(element));
          });
          document.body.querySelector('.cancel').addEventListener('click', () => {
            getContent(1);
            document.body.removeChild(document.querySelector('.overlay'));
          });
        }
      }
    }
  });

  function workDaysBlock(workDaysCount) {
    const pElement = createMyElement('p', '', `Working Days: ${workDaysCount} / ${getWorkDaysInMonth(details.year, details.month)} days`);
    clearDOM(workDays);
    workDays.append(pElement);
  }

  let vacation = details.vacation ? details.vacation : [];
  let workDaysCount = getWorkDaysInMonth(details.year, details.month) - vacation.length;

  tdMonthDays
    .filter((day) => day.textContent !== '' && !day.classList.contains('day-off'))
    .map((day) => day.addEventListener('click', (e) => {
      const vacaitionDayNumber = Number(e.target.textContent);
      if (!vacation.includes(vacaitionDayNumber)) {
        e.target.classList.add('vacation');
        vacation.push(vacaitionDayNumber);
        const filteredVacationData = vacation.filter((f) => f !== '');
        workDaysCount = getWorkDaysInMonth(details.year, details.month) - filteredVacationData.length;
        workDaysBlock(workDaysCount);
      } else {
        const dayIndex = vacation.indexOf(vacaitionDayNumber);
        vacation[dayIndex] = '';
        e.target.classList.remove('vacation');
        workDaysCount += 1;
        workDaysBlock(workDaysCount);
      }
    }));

  workDaysBlock(workDaysCount);

  setVacation.addEventListener('click', () => {
    details.monthlyData[`${details.year}-${details.month}`].employees[details.key].vacationDays = vacation.filter((f) => f !== '');
    localStorage.setItem('monthlyData', JSON.stringify(details.monthlyData));
    document.body.removeChild(document.querySelector('.overlay'));
    getContent(1);
  });
}