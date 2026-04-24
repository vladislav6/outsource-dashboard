import { months } from './lists';

export function getCurrentPeriod () {
  const month = document.querySelector('.months').value;
  const year = document.querySelector('.years').value;

  return {
    month,
    year,
    period: `period: ${months[month]} ${year}`
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