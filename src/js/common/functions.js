import { months } from './lists';

export const getNumber = (n) => +Number(n).toFixed(2);

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
  const assignments = employees
    .filter((employee) => employee.assignments.length !== 0)
    .flatMap((employee) => employee.assignments);
  assignments.forEach(assign => assign ? counts[assign.projectId] = (counts[assign.projectId] || 0) + getNumber(assign.capacity) : '');
  return counts;
}