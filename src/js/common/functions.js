import { months } from './lists';

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

export function noData(spans) {
  const tr = createMyElement('tr');
  const td = createMyElement('td', 'no-data', 'No data.');
  td.colSpan = spans;
  tr.append(td);
  return tr;
}

export function createConfirm(item) {
  const yes = createMyElement('button', 'btn confirm', 'Yes');
  const no = createMyElement('button', 'btn cancel', 'No');
  const content = createMyElement('div', 'confirm-content');
  content.append(yes, no);

  const aboutModal = {
    title: 'Confirm',
    text: `Delete ${item}?`,
    content: content,
    item: 'confirm-modal'
  }

  return createModal(aboutModal);
}