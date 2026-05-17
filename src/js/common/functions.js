import { months } from './lists';

export const getNumber = (n) => +Number(n).toFixed(2);
export const closePopup = () => document.body.removeChild(document.querySelector('.popup'));
export const getAllAssignments = (employees) => employees
        .filter((employee) => employee.assignments.length !== 0)
        .flatMap((employee) => employee.assignments);
export const onDisableButton = (btn) => {
  btn.classList.add('disable'); 
  btn.disabled  = true;
  return btn;
}
export const onActiveButton = (btn) => {
  btn.classList.remove('disable');
  btn.disabled  = false;
  return btn;
}

export const getEmployeeCurrentCapacity =  (assignments) => assignments.length !== 0
  ? getNumber(assignments.reduce((acc, assignEmpl) => acc += getNumber(assignEmpl.capacity), 0))
  : 0.0;

export function getCurrentPeriod () {
  const month = document.querySelector('.months').value;
  const year = document.querySelector('.years').value;

  return {
    month,
    year,
    period: `${months[month]} ${year}`
  };
}

export function clearDOM(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function createMyElement(element, classElement = '', textElement = '') {
  const myElement = document.createElement(element);
  if (textElement) {
    myElement.textContent = textElement;
  }
  if (classElement) {
    myElement.className = classElement;
  }

  return myElement;
}

export function createModal(aboutModal) {
  const overlay = createMyElement('div', 'overlay');
  const modal = createMyElement('div', `modal ${aboutModal.item}`);
  const modalTitle = createMyElement('h2', 'modal-title', aboutModal.title);
  const modalClose = createMyElement('button', 'btn modal-close', 'X');
  const modalContent = createMyElement('div', 'modal-content');
  if (aboutModal.text) {
    const modalText = createMyElement('p', 'modal-text', aboutModal.text);
    modalContent.append(modalText);
  }

  modalContent.append(aboutModal.content);
  modal.append(modalClose, modalTitle, modalContent);
  overlay.append(modal);
  
  overlay.addEventListener('click', (e) => {
    if (e.target.classList.contains('overlay') || e.target.classList.contains('modal-close')) {
      document.body.removeChild(overlay);
    }
  });
  
  return overlay;
}

export function noData(spans, msg = '') {
  const tr = createMyElement('tr');
  const td = createMyElement('td', 'no-data', msg !== '' ? msg : 'No data.');
  td.colSpan = spans;
  tr.append(td);
  return tr;
}

export function createConfirm(text) {
  const yes = createMyElement('button', 'btn confirm', 'Yes');
  const no = createMyElement('button', 'btn cancel', 'No');
  const content = createMyElement('div', 'confirm-content');
  content.append(yes, no);

  const aboutModal = {
    title: 'Confirm',
    text: text,
    content: content,
    item: 'confirm-modal'
  }

  return createModal(aboutModal);
}

export function createPopup(aboutPopup) {
  const popup = createMyElement('div', 'popup');
  const title = createMyElement('h3', 'popup-title', aboutPopup.title);
  const text = createMyElement('p', 'popup-text-block', aboutPopup.text);
  if (aboutPopup.subtext) {
    const subtext = createMyElement('span', 'popup-subtext', aboutPopup.subtext);
    text.append(subtext);
  }
  
  popup.append(title, text, aboutPopup.content);

  return popup;
}

export function getEmployeeAssignmentsCountCapacity(employees) {
  const counts = {};
  const assignments = getAllAssignments(employees);
  assignments.forEach(assign => assign ? counts[assign.projectId] =
    (counts[assign.projectId] || 0) + getNumber(assign.capacity) * getNumber(assign.fit) : 0);
  return counts;
}

export function getWorkDaysInMonth(year, month) {
  let workDays = 0;
  let daysInMonth = new Date(Number(year), Number(month) + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i += 1) {
    let date = new Date(year, month, i);
    let dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workDays += 1;
    }
  }
  return workDays;
}

export function setPopupPosition(popup, popupPosition) {
  const popupHeight = popup.offsetHeight;
  const viewportHeight = window.innerHeight;
  if (popupPosition.bottom > viewportHeight - popupHeight) {
    popup.style.bottom = '20px';
  } else {
    popup.style.top = `${popupPosition.top + popupPosition.height + 10}px`;
  }
}

export function createRange(aboutRange) {
  const range = createMyElement('input', 'range');
  range.type = 'range';
  range.min = 0.1;
  range.max = aboutRange.maxValue;
  range.step = 0.1;
  range.value = aboutRange.value;

  return range;
}

export function createLabel(aboutLabel) {
  const label = createMyElement('label', 'label', `${aboutLabel.labelTitle}`);
  const labelValue = createMyElement('span', `value ${aboutLabel.class}`, `${aboutLabel.value}`);
  const hint = createMyElement('span', 'hint', `${aboutLabel.hintText}`);

  label.append(labelValue, aboutLabel.range, hint);

  return label;
}

export function setBigTable() {
  const rect = document.querySelector('.overlay .table').getBoundingClientRect();
  if (rect.height + rect.x > document.body.offsetHeight) {
    document.querySelector('.modal').classList.add('big-table');
  }
}