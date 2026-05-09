import { createModal, createMyElement } from "../common/functions";
import { weekDaysName, months } from "../common/lists";

export function makeAvailability(details) {
  const availability = createMyElement('div', 'availability-content');
  const table = createMyElement('table', 'calendar');
  const workDays = createMyElement('div', 'work');
  const vacationDays = createMyElement('div', 'vacation');
  const setVacation = createMyElement('button', 'set-vacation', 'Set vacation');

  const currnetDay = new Date().getDay();
  const currentMonthDays = new Date(details.year, details.month + 1, 0).getDate();
  console.log(weekDaysName[currnetDay]);
  console.log(currentMonthDays);

  vacationDays.append(setVacation);
  availability.append(table, workDays, vacationDays);

  const modal = createModal({
    title: `${details.name} - Availability`,
    content: availability,
    text: `${months[details.month]} ${details.year}`,
    item: 'availability'
  });

  document.body.append(modal);
}